import React, { useState, useEffect, useContext, state } from "react";
import { Link } from 'react-router-dom';
import { Redirect } from "react-router-dom";
import AuthorizationFetch from "../../api/AuthorizationFetch"
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import AuthContext from "../../context/AuthContext";

const Login = (props) => {
    const { t, i18n } = useTranslation('common');
    const auth = new AuthorizationFetch()

    const [loginValue, setLoginValue] = useState(null);
    const UpdateLoginValue = (e) => {
        setLoginValue({ ...loginValue, [e.name]: e.value });
    }
    const [isError, setIsError] = useState(false)
    const { onLogin, onAdmin } = useContext(AuthContext);
    const SingUp = async (e) => {
        e.preventDefault()
        await auth.SingIn(loginValue.login, loginValue.password)
            .then(x => {
                if (x.length > 0) {
                    const jwtDecode = require('jwt-decode');
                    const res = jwtDecode(x)
                    Cookies.set('token', x)
                    Cookies.set('firstName', res.firstName)
                    Cookies.set('lastName', res.lastName)
                    Cookies.set('id', res.id)
                    onLogin(true);
                    if (res.isAdmin)
                        onAdmin(true)
                    props.history.push("/");
                }
                else {
                    setIsError(true)
                }
            })

    }


    return (
        <>
            <div className="user-banner">
                <div className="user-banner__txt user-banner__txt--title">{t('common.singUpDes')}</div>
            </div>
            <div className="container">
                <form className="user-sign-box" onSubmit={x => SingUp(x)}>
                    <div className="user-sign-box__content">
                        <div className="user-sign-box__txt">
                            {t('common.login')}
                        </div>
                        <input type="txt" className="user-sign-box__input" name="login" onChange={x => UpdateLoginValue(x.target)} />
                    </div>
                    <div className="user-sign-box__content">
                        <div className="user-sign-box__txt">
                            {t('common.password')}
                        </div>
                        <input type="password" className="user-sign-box__input" name="password" onChange={x => UpdateLoginValue(x.target)} />
                    </div>
                    <div className="user-sign-box__content user-sign-box__content--button">
                        <input className="user-sign-box__button" type="submit" value=    {t('common.singUp')}></input>
                    </div>
                    {isError && <div className="user-sign-box__content user-sign-box__content--error" >
                        <div className="user-sign-box__txt user-sign-box__txt--error" >
                            {t('common.loginError')}
                        </div>
                    </div>}
                </form>
            </div>
        </>
    )
}

export default Login;