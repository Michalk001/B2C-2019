import React, { useState, useEffect, state, useReducer } from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const Page = () => {

    const { t, i18n } = useTranslation('common');
    return (

        <div className="container">
            <div className="user-dashboard">
                <div className="user-dashboard__card user-dashboard__card--large">
                    <div className="user-dashboard__txt user-dashboard__txt--card-title">README</div>
                    <div className="user-dashboard__content user-dashboard__content--card">
                        <div>{t('readme.adminData')}</div>
                        <div>{t('common.login')}: janko {t('common.password')}: Kowalski</div>
                        <div>{t('readme.userData')}</div>
                        <div>{t('common.login')}: adano {t('common.password')}: Nowak</div>
                    </div>

                </div>

               

            </div>
        </div>
    );

}

export default Page;