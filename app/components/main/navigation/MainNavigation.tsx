'use client';
import { usePathname } from 'next/navigation';
import { Box, Button, styled } from '@mui/material';
import NextLink from 'next/link';

interface NavItem {
  title: string;
  href: string;
}

const navItems: NavItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Basic', href: '/basic' },
  { title: 'Premium', href: '/premium' },
];

export default function MainNavigation() {
  const pathname = usePathname();

  const StyledButton = styled(Button)<{ component?: React.ElementType }>(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: 500,
    fontSize: '15px',
    textTransform: 'none',
    padding: '8px 16px',
    minWidth: 'auto',
    textDecoration: 'none',

    '&.active': {
      backgroundColor: 'rgba(93, 135, 255, 0.15)',
      color: theme.palette.primary.main,
    },

    '&:hover': {
      backgroundColor: 'rgba(93, 135, 255, 0.08)',
    },
  }));

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <StyledButton
            key={item.href}
            className={isActive ? 'active' : 'not-active'}
            variant="text"
            color="inherit"
            LinkComponent={NextLink}
            href={item.href}
          >
            {item.title}
          </StyledButton>
        );
      })}
    </Box>
  );
}
