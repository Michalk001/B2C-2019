import React from "react";

const AuthContext = React.createContext({
    isLogin: false,
    isAdmin: false,
    onAdmin: () =>{},
    onLogin: () => { },
    onLogout: () => { }
})

export default AuthContext