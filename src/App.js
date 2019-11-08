

import {
    BrowserRouter,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';
import React, { useState, useEffect, state } from "react";

import Page from "./component/mainPage/Page"
import Header from "./component/mainPage/Header"
import Footer from "./component/mainPage/Footer"
import Employee from "./component/management/employee/Employee"
import Project from "./component/management/project/Project"
import EmployeeSummary from './component/user/EmployeeSummary';
import ProjectSummary from './component/user/ProjectSummary';
import Login from './component/account/Login';
import Management from './component/management/Management';
import { I18nextProvider } from 'react-i18next';

import Cookies from 'js-cookie';
import AuthContext from './context/AuthContext';
import { i18nInit } from './translations/i18nInit';

const checkIsAdmin = () => {
    if (Cookies.get('token')) {
        const jwtDecode = require('jwt-decode');
        const decoded = jwtDecode(Cookies.get('token'));
        if (decoded.isAdmin) {
            return true
        }
    }
    return false
}

const checkIsLogin = () => {
    if (Cookies.get('token'))
        return true
    else
        return false
}




const UserRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        checkIsLogin() === true
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
)

const AdminRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        checkIsAdmin() === true
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
)

export const App = () => {
    const [isLogin, setIsLogin] = useState(checkIsLogin());
    const [isAdmin, setIsAdmin] = useState(checkIsAdmin());
    return (
        <I18nextProvider i18n={i18nInit()}>
            <BrowserRouter>
                <AuthContext.Provider
                    value={
                        {
                            isLogin,
                            isAdmin,
                            onAdmin: setIsAdmin,
                            onLogin: setIsLogin,
                            onLogout: () => { setIsLogin(false); setIsAdmin(false) }
                        }
                    }>
                    <Header />
                    <div className="user ">
                        <div className="user-fix">
                            <Switch>
                                <Route exact path="/" component={Page} />
                                <UserRoute path="/Employee/:id" component={EmployeeSummary} />
                                <UserRoute path="/Project/:id" component={ProjectSummary} />
                                <AdminRoute path="/management/Employee/" component={Employee} />
                                <AdminRoute path="/management/Project" component={Project} />
                                <AdminRoute path="/management/" component={Management} />
                                <UserRoute path='/protected' component={Management} />
                                <Route path="/login" component={Login} />
                            </Switch>

                        </div>
                        <Footer />
                    </div>
                 
                </AuthContext.Provider>
            </BrowserRouter>
        </I18nextProvider>
    );
}




