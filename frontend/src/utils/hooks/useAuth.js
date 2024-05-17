import React, { useContext } from "react"
import { AuthContext } from "../context/authContext"

function useAuth(){
    const auth = useContext(AuthContext);    
    return auth;
}

export { useAuth }