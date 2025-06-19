'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { signOut } from 'aws-amplify/auth';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem as MuiMenuItem,
  useTheme,
  useMediaQuery,
  styled,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import our navigation components
import MenuItems from '@/app/components/admin/navigation/MenuItems';
import NavItem from '@/app/components/admin/navigation/NavItem';
import NavCollapse from '@/app/components/admin/navigation/NavCollapse';
import NavGroup from '@/app/components/admin/navigation/NavGroup';
import Scrollbar from '@/app/components/shared/Scrollbar';
import { AdminOnly } from '@/app/components/shared/auth/ProtectedRoute';

const sidebarWidth = 270;
const miniSidebarWidth = 87;
const topbarHeight = 70;

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
}));

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  paddingBottom: '60px',
  flexDirection: 'column',
  zIndex: 1,
  width: '100%',
  backgroundColor: 'transparent',
  overflow: 'hidden',
}));

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  background: theme.palette.background.paper,
  justifyContent: 'center',
  backdropFilter: 'blur(4px)',
  [theme.breakpoints.up('lg')]: {
    minHeight: topbarHeight,
  },
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  width: '100%',
  color: theme.palette.text.secondary,
}));

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebar, setIsMobileSidebar] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const pathname = usePathname();
  const pathDirect = pathname || '';
  const pathWithoutLastPart = pathname ? pathname.slice(0, pathname.lastIndexOf('/')) : '';

  const toggleWidth = isCollapsed ? miniSidebarWidth : sidebarWidth;

  const handleDrawerToggle = () => {
    if (lgUp) {
      // For large screens, toggle between full-sidebar and mini-sidebar
      setIsCollapsed(!isCollapsed);
    } else {
      // For smaller screens, toggle mobile sidebar
      setIsMobileSidebar(!isMobileSidebar);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();

      // Manually refresh auth state to trigger redirect
      if ((window as any).refreshAuthState) {
        (window as any).refreshAuthState();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
    handleMenuClose();
  };

  const hideMenu = isCollapsed;

  return (
    <AdminOnly>
      <MainWrapper>
        {/* Sidebar */}
        {lgUp ? (
          <Box
            sx={{
              zIndex: 100,
              width: toggleWidth,
              flexShrink: 0,
            }}
          >
            {/* Desktop Sidebar */}
            <Drawer
              anchor="left"
              open
              variant="permanent"
              sx={{
                '& .MuiDrawer-paper': {
                  transition: theme.transitions.create('width', {
                    duration: theme.transitions.duration.shortest,
                  }),
                  width: toggleWidth,
                  boxSizing: 'border-box',
                },
              }}
            >
              <Box sx={{ height: '100%' }}>
                {/* Logo */}
                <Box sx={{ px: 3, py: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      display: hideMenu ? 'none' : 'block',
                    }}
                  >
                    MyApp
                  </Typography>
                </Box>

                {/* Scrollable Navigation */}
                <Scrollbar sx={{ height: 'calc(100% - 190px)', px: 2 }}>
                  <List sx={{ pt: 0 }}>
                    {MenuItems.map((item: any) => {
                      if (item.subheader) {
                        return (
                          <NavGroup
                            key={item.subheader}
                            item={item}
                            hideMenu={hideMenu}
                          />
                        );
                      } else if (item.children) {
                        return (
                          <NavCollapse
                            key={item.id}
                            menu={item}
                            pathDirect={pathDirect}
                            pathWithoutLastPart={pathWithoutLastPart}
                            level={1}
                            hideMenu={hideMenu}
                            onClick={() => setIsMobileSidebar(false)}
                          />
                        );
                      } else {
                        return (
                          <NavItem
                            key={item.id}
                            item={item}
                            pathDirect={pathDirect}
                            hideMenu={hideMenu}
                            onClick={() => setIsMobileSidebar(false)}
                          />
                        );
                      }
                    })}
                  </List>
                </Scrollbar>

                {/* Footer */}
                {!hideMenu && (
                  <Box sx={{ p: 2, textAlign: 'center', mt: 'auto' }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      © 2024 MyApp
                    </Typography>
                  </Box>
                )}
              </Box>
            </Drawer>
          </Box>
        ) : (
          <Drawer
            anchor="left"
            open={isMobileSidebar}
            onClose={() => setIsMobileSidebar(false)}
            variant="temporary"
            sx={{
              '& .MuiDrawer-paper': {
                width: sidebarWidth,
                border: '0 !important',
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <Box sx={{ px: 2 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', py: 2 }}
              >
                MyApp
              </Typography>
            </Box>
            <Scrollbar>
              <List sx={{ pt: 0 }}>
                {MenuItems.map((item: any) => {
                  if (item.subheader) {
                    return (
                      <NavGroup
                        key={item.subheader}
                        item={item}
                      />
                    );
                  } else if (item.children) {
                    return (
                      <NavCollapse
                        key={item.id}
                        menu={item}
                        pathDirect={pathDirect}
                        pathWithoutLastPart={pathWithoutLastPart}
                        level={1}
                        onClick={() => setIsMobileSidebar(false)}
                      />
                    );
                  } else {
                    return (
                      <NavItem
                        key={item.id}
                        item={item}
                        pathDirect={pathDirect}
                        onClick={() => setIsMobileSidebar(false)}
                      />
                    );
                  }
                })}
              </List>
            </Scrollbar>
          </Drawer>
        )}

        {/* Main Content */}
        <PageWrapper className="page-wrapper">
          {/* Header */}
          <AppBarStyled
            position="sticky"
            color="default"
          >
            <ToolbarStyled>
              <IconButton
                color="inherit"
                aria-label="toggle drawer"
                onClick={handleDrawerToggle}
                edge="start"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>

              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1 }}
              >
                MyApp Admin
              </Typography>

              {/* Notifications */}
              <IconButton
                color="inherit"
                onClick={handleNotificationsOpen}
                sx={{ mr: 1 }}
              >
                <Badge
                  badgeContent={4}
                  color="error"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Messages */}
              <IconButton
                color="inherit"
                sx={{ mr: 1 }}
              >
                <Badge
                  badgeContent={2}
                  color="error"
                >
                  <MessageIcon />
                </Badge>
              </IconButton>

              {/* User Profile */}
              <IconButton
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
            </ToolbarStyled>
          </AppBarStyled>

          {/* Page Content */}
          <Container
            sx={{
              pt: '30px',
              maxWidth: '100%!important',
            }}
          >
            <Box sx={{ minHeight: 'calc(100vh - 170px)' }}>{children}</Box>
          </Container>
        </PageWrapper>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MuiMenuItem onClick={handleMenuClose}>Profile</MuiMenuItem>
          <MuiMenuItem onClick={handleMenuClose}>Account Settings</MuiMenuItem>
          <MuiMenuItem onClick={handleMenuClose}>Support Center</MuiMenuItem>
          <Divider />
          <MuiMenuItem onClick={handleSignOut}>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </MuiMenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchorEl}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MuiMenuItem onClick={handleMenuClose}>New order received</MuiMenuItem>
          <MuiMenuItem onClick={handleMenuClose}>Payment processed</MuiMenuItem>
          <MuiMenuItem onClick={handleMenuClose}>System update available</MuiMenuItem>
          <MuiMenuItem onClick={handleMenuClose}>New user registered</MuiMenuItem>
        </Menu>
      </MainWrapper>
      <ToastContainer />
    </AdminOnly>
  );
}
