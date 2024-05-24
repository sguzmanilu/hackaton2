import React from 'react';
import style from '../login/style.module.css';
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
          style={{ backgroundImage: `url('/goku-cloud.gif')` }}
        >
        </div>
        
      </div>
    </div>
  )
}

export default Register;

