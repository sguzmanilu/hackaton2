import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Outlet } from 'react-router-dom';
import style from './style.module.css';
import CssBaseline from "@mui/material/CssBaseline";
import { AuthContext } from '../../utils/context/authContext';
import { useNavigate } from "react-router-dom";
import AdbIcon from '@mui/icons-material/Adb';
import { Button } from '@mui/material';

const pages = ['Products', 'Pricing', 'Blog'];

function MainAppBar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { getUser, getName, logout } = React.useContext(AuthContext);

  const navigate = useNavigate();

  const settings = [
    {
      name: 'Profile',
      onClick: () => { }
    },
    {
      name: 'Logout',
      onClick: () => {
        logout();
        navigate('/login');
      }
    }
  ];

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: 'column' }}>
      <CssBaseline />
      <AppBar position="static" className={style.appbar}>
        <Container maxWidth="xxl" disableGutters >
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 0, display: 'flex' }}>
              {/* <img src='/logoILU.png' className={style.logoilu} /> */}
              <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                HACKATON
              </Typography>

            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => null}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                <div style={{ display: 'flex', flex: 1, flexDirection: 'column', marginRight: '2rem' }}>
                  <Typography sx={{ lineHeight: 1 }} variant='button'>{getName()}</Typography>
                  <Typography sx={{ lineHeight: 1 }} variant='caption' color='#B6B4B4'>{getUser()}</Typography>
                </div>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={getName()} src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
              </div>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={setting.onClick}>
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <div className={style.content}>
        <Outlet />
      </div>
    </Box>
  );
}
export default MainAppBar;