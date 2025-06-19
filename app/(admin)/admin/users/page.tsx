'use client';
import { useState, useEffect } from 'react';
import { Typography, Box, Chip, Avatar, IconButton, CircularProgress } from '@mui/material';
import { Edit as EditIcon, Person as PersonIcon } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { generateClient } from 'aws-amplify/data';
// import { getCurrentUser } from 'aws-amplify/auth'; // Temporarily disabled for development
import PageContainer from '@/app/components/shared/PageContainer';
import PageCard from '@/app/components/shared/PageCard';
import EditUserDialog from './EditUserDialog';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

interface UserProfile {
  cognitoUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  userTier?: 'basic' | 'premium' | 'editor' | 'admin';
  lastLoginAt?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Check if current user is admin
  // const isAdmin = currentUser?.signInUserSession?.accessToken?.payload?.['cognito:groups']?.includes('admin');
  const isAdmin = true; // Temporarily allow all authenticated users for development

  useEffect(() => {
    loadUsers(); // Always load users since isAdmin is temporarily true
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await client.models.UserProfile.list();
      setUsers(result.data as UserProfile[]);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = () => {
    loadUsers(); // Refresh the users list
  };

  const getTierColor = (
    tier?: string,
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (tier) {
      case 'admin':
        return 'error';
      case 'editor':
        return 'info';
      case 'premium':
        return 'warning';
      case 'basic':
        return 'default';
      default:
        return 'default';
    }
  };

  const getDisplayName = (user: UserProfile) => {
    if (user.displayName) return user.displayName;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    return user.email.split('@')[0];
  };

  const columns: GridColDef[] = [
    {
      field: 'user',
      headerName: 'User',
      width: 250,
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Avatar
            src={params.row.avatar}
            sx={{ width: 32, height: 32 }}
          >
            <PersonIcon />
          </Avatar>
          <Typography
            variant="body2"
            fontWeight={500}
          >
            {getDisplayName(params.row)}
          </Typography>
        </Box>
      ),
      sortComparator: (v1, v2, param1, param2) => {
        const name1 = getDisplayName(param1.api.getRow(param1.id)!);
        const name2 = getDisplayName(param2.api.getRow(param2.id)!);
        return name1.localeCompare(name2);
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      filterable: true,
    },
    {
      field: 'userTier',
      headerName: 'Tier',
      width: 120,
      renderCell: (params) => {
        const tier = params.value || 'basic';
        const capitalizedTier = tier.charAt(0).toUpperCase() + tier.slice(1);
        return (
          <Chip
            label={capitalizedTier}
            color={getTierColor(params.value)}
            size="small"
            variant="outlined"
          />
        );
      },
      type: 'singleSelect',
      valueOptions: ['basic', 'premium', 'editor', 'admin'],
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'error'}
          size="small"
          variant="outlined"
        />
      ),
      type: 'boolean',
    },
    {
      field: 'lastLoginAt',
      headerName: 'Last Login',
      width: 150,
      type: 'dateTime',
      valueGetter: (value) => {
        return value ? new Date(value) : null;
      },
      renderCell: (params) => (
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {params.value ? new Date(params.value).toLocaleDateString() : 'Never'}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 150,
      type: 'dateTime',
      valueGetter: (value) => {
        return value ? new Date(value) : null;
      },
      renderCell: (params) => (
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {params.value ? new Date(params.value).toLocaleDateString() : 'Unknown'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          color="primary"
          onClick={() => {
            setSelectedUser(params.row);
            setEditDialogOpen(true);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  if (!isAdmin) {
    return (
      <PageContainer
        title="Access Denied"
        description="Admin access required"
      >
        <PageCard title="Access Denied">
          <Typography color="error">You need admin privileges to access user management.</Typography>
        </PageCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="User Management"
      description="Manage user accounts and permissions"
    >
      <PageCard title="User Management">
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            p={4}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row.cognitoUserId}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection={false}
              disableRowSelectionOnClick
              showToolbar
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{}}
            />
          </Box>
        )}
      </PageCard>

      <EditUserDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
      />
    </PageContainer>
  );
}
