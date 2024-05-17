import React, { useState } from "react";
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const getToken = () => {
    const storage = localStorage.getItem("user");
    if (storage) {
      return JSON.parse(storage).token;
    }
    return null;
  };

  const getUsuario = () => {
    const storage = localStorage.getItem("user");
    if (storage) {
      return JSON.parse(storage).usuario;
    }
    return null;
  };

  const getUser = () => {
    const storage = localStorage.getItem("user");
    if (storage) {
      return JSON.parse(storage).usuario;
    }
    return null;
  };

  const getNombre = () => {
    const storage = localStorage.getItem("user");
    if (storage) {
      const data = JSON.parse(storage);
      const { nombre, apellido } = data;
      return `${nombre}`;
    }
    return null;
  };

  const getSelectedUserID = () => {
    if(!selectedUser) return null;
    return selectedUser.id;
  }
  
  const getSelectedUserDPI = () => {
    if(!selectedUser) return null;
    return selectedUser.usuario;
  }

  const getSelectedUserName = () => {
    if(!selectedUser) return getNombre();
    return selectedUser.nombre;
  }

  const isAuthenticated = () => {
    const storage = localStorage.getItem("user");
    if (storage && JSON.parse(storage).token) {
      return true;
    }
    return false;
  };

  const login = (data) => {
    localStorage.setItem("user", data);
  };

  const logout = () => {
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        getToken,
        login,
        logout,
        getUser,
        getNombre,        
        selectedUser,
        setSelectedUser,
        getSelectedUserName,
        getSelectedUserDPI,
        getSelectedUserID,
        getUsuario
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
