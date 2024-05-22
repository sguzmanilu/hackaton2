import React from 'react';
import style from './style.module.css';
import RegisterForm from './registerForm';


const Register = (props) => {

  return (
    <div className={style.loginContainer}>
      <div className={style.loginFormContainer}>
        <RegisterForm />
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

export default Register;

