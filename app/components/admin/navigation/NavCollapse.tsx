import React, { useState } from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse, Chip, styled } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { MenuItem } from './MenuItems';
import NavItem from './NavItem';

interface NavCollapseProps {
  menu: MenuItem;
  pathDirect: string;
  pathWithoutLastPart: string;
  level: number;
  hideMenu?: boolean;
  onClick?: () => void;
}

const NavCollapse: React.FC<NavCollapseProps> = ({
  menu,
  pathDirect,
  pathWithoutLastPart,
  level,
  hideMenu = false,
  onClick,
}) => {
  const Icon = menu.icon;

  // Enhanced active state logic to support sub-paths
  const isChildActive = React.useMemo(() => {
    return (
      menu.children?.some((child) => {
        if (!child.href) return false;

        // Exact match
        if (pathDirect === child.href || pathWithoutLastPart === child.href) return true;

        // For certain paths, also match sub-paths
        if (
          false // Remove hardcoded path logic
        ) {
          return true;
        }

        return false;
      }) || false
    );
  }, [pathDirect, pathWithoutLastPart, menu.children]);

  const [open, setOpen] = useState(isChildActive);

  const handleToggle = () => {
    setOpen(!open);
  };

  const itemIcon = Icon ? level > 1 ? <Icon sx={{ fontSize: '1rem' }} /> : <Icon sx={{ fontSize: '1.3rem' }} /> : null;

  const ListItemStyled = styled(ListItemButton)(({ theme: muiTheme }) => ({
    whiteSpace: 'nowrap',
    marginBottom: '2px',
    padding: '8px 10px',
    borderRadius: '8px',
    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    color: isChildActive ? muiTheme.palette.primary.main : muiTheme.palette.text.secondary,
    paddingLeft: hideMenu ? '0px' : level > 2 ? `${level * 15}px` : '10px',
    '&:hover': {
      backgroundColor: muiTheme.palette.primary.light,
      color: muiTheme.palette.primary.main,
    },
    ...(isChildActive && {
      color: 'white',
      backgroundColor: muiTheme.palette.primary.main,
      '&:hover': {
        backgroundColor: muiTheme.palette.primary.main,
        color: 'white',
      },
    }),
  }));

  return (
    <>
      <List
        component="li"
        disablePadding
        key={menu.id}
      >
        <ListItemStyled onClick={handleToggle}>
          {itemIcon && (
            <ListItemIcon
              sx={{
                minWidth: '36px',
                p: '3px 0',
                color: isChildActive ? 'white' : 'inherit',
                ...(hideMenu && {
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }),
              }}
            >
              {itemIcon}
            </ListItemIcon>
          )}

          <ListItemText>{hideMenu ? '' : menu.title}</ListItemText>

          {menu.chip && !hideMenu && (
            <Chip
              color={menu.chipColor || 'default'}
              variant="filled"
              size="small"
              label={menu.chip}
              sx={{
                height: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                mr: 1,
              }}
            />
          )}

          {!hideMenu && (open ? <ExpandLess sx={{ fontSize: '1rem' }} /> : <ExpandMore sx={{ fontSize: '1rem' }} />)}
        </ListItemStyled>
      </List>

      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
      >
        <List
          component="div"
          disablePadding
        >
          {menu.children?.map((child) => (
            <NavItem
              key={child.id}
              item={child}
              level={level + 1}
              pathDirect={pathDirect}
              hideMenu={hideMenu}
              onClick={onClick}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default NavCollapse;
