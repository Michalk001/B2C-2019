
import React, { useState, useEffect, state, useContext } from "react";
import { Redirect } from 'react-router-dom';
import AuthContext from "../../context/AuthContext";


const ReqLogin = ({ComposedComponent,props}) => {

    const { isLogin } = useContext(AuthContext);

    console.log(ComposedComponent)
    if (!isLogin) {
       
    }
    else
        return (ComposedComponent())

}

export default ReqLogin;


