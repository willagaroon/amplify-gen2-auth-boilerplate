import React from 'react';
import { List, ListSubheader, styled } from '@mui/material';
import { MoreHoriz as DotsIcon } from '@mui/icons-material';
import { MenuItem } from './MenuItems';

interface NavGroupProps {
  item: MenuItem;
  hideMenu?: boolean;
}

const NavGroup: React.FC<NavGroupProps> = ({ item, hideMenu = false }) => {
  const ListSubheaderStyled = styled(ListSubheader)(({ theme }) => ({
    ...theme.typography.overline,
    fontWeight: 700,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(0),
    color: theme.palette.text.primary,
    lineHeight: '26px',
    padding: '3px 12px',
    fontSize: '0.75rem',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    justifyContent: hideMenu ? 'center' : 'flex-start',
  }));

  if (hideMenu) {
    return (
      <List
        subheader={
          <ListSubheaderStyled
            disableSticky
            sx={{ backgroundColor: 'transparent' }}
          >
            <DotsIcon
              sx={{
                fontSize: '14px',
              }}
            />
          </ListSubheaderStyled>
        }
      />
    );
  }

  return (
    <List
      subheader={
        <ListSubheaderStyled
          disableSticky
          sx={{ backgroundColor: 'transparent' }}
        >
          {item.subheader}
        </ListSubheaderStyled>
      }
    />
  );
};

export default NavGroup;
