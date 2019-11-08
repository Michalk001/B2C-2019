import React, { useState, useEffect, state, useReducer } from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Management = () => {
    const { t, i18n } = useTranslation('common');
    return (

        <div className="container">
            <div className="user-dashboard">
                <Link className="user-dashboard__card" to="/management/Project">
                    <div className="user-dashboard__txt user-dashboard__txt--card-title">{t('adminPanel.projectManagement')}</div>
                    <div className="user-dashboard__content user-dashboard__content--card">
                        <div>{t('adminPanel.addProject')}</div>
                        <div>{t('adminPanel.removeProject')}</div>
                        <div>{t('adminPanel.projectsList')}</div>
                    
                    </div>

                </Link>

                <Link className="user-dashboard__card" to="/management/Employee">
                    <div className="user-dashboard__txt user-dashboard__txt--card-title">{t('adminPanel.employeeManagement')}</div>
                    <div className="user-dashboard__content user-dashboard__content--card">
                        <div>{t('adminPanel.addEmployee')}</div>
                        <div>{t('adminPanel.removeEmployee')}</div>
                        <div>{t('adminPanel.employeesList')}</div>
                    </div>
                </Link>

            </div>
        </div>
    );

}

export default Management;