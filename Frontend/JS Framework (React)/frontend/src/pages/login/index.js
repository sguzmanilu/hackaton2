import React from 'react';
import style from './style.module.css';
import LoginForm from './loginForm';


const Login = (props) => {

  return (
    <div className={style.loginContainer}>
      <div className={style.loginFormContainer}>
        <LoginForm />
      </div>
      <div className={style.loginLogoContainer}>
        <div
          className={`${style.loginLogoPanel} animate__animated animate__backInUp`}
          style={{ backgroundImage: `url('/portada.webp')` }}
        >
        </div>
      </div>
    </div>
  )
}

export default Login;

