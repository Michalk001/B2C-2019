import React from "react";
import { useTranslation } from 'react-i18next';

const NoMatch = ({code,text}) => {
    const { t } = useTranslation('common')
    return (
        <div className="view">
            <div className="view__container view__container--summmary">
                <div className="view__row ">
                     <div className="view__content view__content--large">
                     <div className="view__txt-error-page-screen view__txt-error-page-screen--code">
                               {code ? code : "404"}
                     </div>
                     <div className="view__txt-error-page-screen ">
                              {text ? text : t('error.notFoundPage') }
                     </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoMatch;