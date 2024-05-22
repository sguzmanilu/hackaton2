import React from 'react';
import style from './style.module.css';
import { Typography } from '@mui/material';
import LoginForm from './loginForm';


const Login = (props) => {

  return (
    <div className={style.loginContainer}>
      <div className={style.loginFormContainer}>
        <LoginForm />
      </div>
      <div className={style.loginLogoContainer}>
        <div
          className={style.loginLogoPanel}
          style={{ backgroundImage: `url('/portada.webp')` }}
        >
        </div>
      </div>
    </div>
  )
}

export default Login;

