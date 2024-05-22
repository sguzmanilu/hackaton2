import React, { useState } from 'react';
import style from './style.module.css';
import { useNavigate } from "react-router-dom";
import { Typography, TextField, Grid, Button, IconButton } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from "react-toastify";
import LoadingButton from '../../components/loadingButton';
import { AuthContext } from "../../utils/context/authContext";
import api from "../../utils/api";

export default function LoginForm(props) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e?.preventDefault();
    if (username !== "" && password !== "") {
      setLoading(true)
      api.Post('auth', { username, password })
        .then((response) => {
          toast.success("Bienvenido");
          login(JSON.stringify(response.data))
          navigate(`/`);
        })
        .catch((e) => {
          toast.error("Error al iniciar sesión");
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const handleRegister = () => {
    navigate('/register')
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className={style.loginForm}>
      <Typography
        variant='h4'
        style={{ marginBottom: '5rem', textAlign: 'center'}}
      >
        Hola, Bienvenido
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            id="username"
            label="Usuario"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="password"
            label="Contraseña"
            type={showPassword ? 'text': 'password'}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            fullWidth
            loading={loading}
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >Iniciar Sesión</LoadingButton>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="text"
            color="secondary"
            onClick={handleRegister}
          >
            Registrarse
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}
