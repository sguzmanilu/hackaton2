import React, { useState } from 'react';
import style from '../login/style.module.css';
import { useNavigate } from "react-router-dom";
import { Typography, TextField, Grid, Button, IconButton } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from "react-toastify";
import LoadingButton from '../../components/loadingButton';
import api from "../../utils/api";

export default function RegisterForm(props) {

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e?.preventDefault();
    if (name !== "" && username !== "" && password !== "") {
      setLoading(true)
      api.Post('register', { name, username, password, type: 2 })
        .then((response) => {
          console.log('data ', response.data)
          toast.success("Inicia sesión para continuar");
          navigate(`/login`);
        })
        .catch((e) => {
          toast.error("Error al registrarse, intente nuevamente");
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className={style.loginForm}>
      <Typography
        variant='h4'
        style={{ marginBottom: '5rem', textAlign: 'center' }}
      >
        Registrarme
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            id="name"
            label="Nombre completo"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </Grid>
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
            type={showPassword ? 'text' : 'password'}
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
            onClick={handleRegister}
          >Registrarme</LoadingButton>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="text"
            color="secondary"
            onClick={() => navigate(`/login`)}
          >
            Regresar
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}
