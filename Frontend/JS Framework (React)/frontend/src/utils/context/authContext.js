import React from "react";
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {

  const getToken = () => {
    const storage = localStorage.getItem("user");
    if (storage) {
      return JSON.parse(storage).token;
    }
    return null;
  };

  const getUser = () => {
    const storage = localStorage.getItem("user");
    if (storage) {
      return JSON.parse(storage).username;
    }
    return null;
  };

  const getName = () => {
    const storage = localStorage.getItem("user");
    if (storage) {
      return JSON.parse(storage).name;
    }
    return null;
  };

  const getUserId = () => {
    const storage = localStorage.getItem("user");
    if (storage) {
      return JSON.parse(storage).id;
    }
    return null;
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
        getName,
        getUserId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
