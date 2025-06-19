import React from 'react';
import Link from 'next/link';
import { List, ListItemButton, ListItemIcon, ListItemText, Chip, useTheme, styled } from '@mui/material';
import { FiberManualRecordOutlined } from '@mui/icons-material';
import { MenuItem } from './MenuItems';

interface NavItemProps {
  item: MenuItem;
  level?: number;
  pathDirect: string;
  hideMenu?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, level = 1, pathDirect, hideMenu = false, onClick }) => {
  const theme = useTheme();
  const Icon = item.icon;

  // Enhanced active state logic to support sub-paths
  const isActive = React.useMemo(() => {
    if (!item.href) return false;

    // Exact match
    if (pathDirect === item.href) return true;

    // For certain paths, also match sub-paths
    // Example: if (item.href === '/admin/some-path' && pathDirect.startsWith('/admin/some-path/')) {
    //   return true;
    // }

    return false;
  }, [pathDirect, item.href]);

  const itemIcon = Icon ? level > 1 ? <Icon sx={{ fontSize: '1rem' }} /> : <Icon sx={{ fontSize: '1.3rem' }} /> : null;

  const ListItemStyled = styled(ListItemButton)(({ theme: muiTheme }) => ({
    whiteSpace: 'nowrap',
    marginBottom: '2px',
    padding: '8px 10px',
    borderRadius: '8px',
    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    color: level > 1 && isActive ? `${muiTheme.palette.primary.main}!important` : muiTheme.palette.text.secondary,
    paddingLeft: hideMenu ? '0px' : level > 2 ? `${level * 15}px` : '10px',
    '&:hover': {
      backgroundColor: muiTheme.palette.primary.light,
      color: muiTheme.palette.primary.main,
    },
    '&.Mui-selected': {
      color: 'white',
      backgroundColor: muiTheme.palette.primary.main,
      '&:hover': {
        backgroundColor: muiTheme.palette.primary.main,
        color: 'white',
      },
    },
  }));

  if (!item.href) return null;

  return (
    <List
      component="li"
      disablePadding
      key={item.id}
    >
      <Link
        href={item.href}
        style={{ textDecoration: 'none' }}
      >
        <ListItemStyled
          selected={isActive}
          onClick={onClick}
        >
          {level > 1 ? (
            // Sub-item with dot icon aligned with main nav icons
            <ListItemIcon
              sx={{
                minWidth: '36px',
                p: '3px 0',
                color: isActive ? `${theme.palette.primary.main}!important` : 'inherit',
                ...(hideMenu && {
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }),
              }}
            >
              <FiberManualRecordOutlined sx={{ fontSize: '0.7rem', ml: hideMenu ? '0' : '0.3rem' }} />
            </ListItemIcon>
          ) : (
            // Main item - always show container for comparison
            <ListItemIcon
              sx={{
                minWidth: '36px',
                p: '3px 0',
                color: isActive ? 'white' : 'inherit',
                ...(hideMenu && {
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }),
              }}
            >
              {itemIcon || <span style={{ width: '24px', height: '24px', display: 'block' }} />}
            </ListItemIcon>
          )}

          <ListItemText>{hideMenu ? '' : item.title}</ListItemText>

          {item.chip && !hideMenu && (
            <Chip
              color={item.chipColor || 'default'}
              variant="filled"
              size="small"
              label={item.chip}
              sx={{
                height: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            />
          )}
        </ListItemStyled>
      </Link>
    </List>
  );
};

export default NavItem;
