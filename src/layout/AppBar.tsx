import React from 'react';
import { AppBar, Logout, UserMenu, useTranslate } from 'react-admin';
import { Link } from 'react-router-dom';
import {
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ProfileIcon from '@mui/icons-material/ManageAccounts';

const ProfileMenu = React.forwardRef((props, ref) => {
  const translate = useTranslate();
  return (
    <MenuItem
      component={Link}
      // @ts-ignore
      ref={ref}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      to='/profile'
    >
      <ListItemIcon>
        <ProfileIcon />
      </ListItemIcon>
      <ListItemText>{translate('profile.title')}</ListItemText>
    </MenuItem>
  );
});
ProfileMenu.displayName = "ProfileMenu";

const CustomUserMenu: React.FC = () => (
  <UserMenu>
    <ProfileMenu />
    <Logout />
  </UserMenu>
);

const CustomAppBar: React.FC<any> = (props) => (
  <AppBar
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    color="secondary"
    elevation={1}
    userMenu={<CustomUserMenu />}
  />
);

export default CustomAppBar;
