import React, { useState, useEffect, state } from "react";

import { useTranslation } from 'react-i18next';

const InfoBox = ({ txt, callback }) => {
    const { t, i18n } = useTranslation('common');
    return (
        <>
            <div className="confirm__background" />
            <div className="confirm__box">
                <div className="confirm__content">
                    <div className="confirm__txt">{txt}</div>
                    <div className="confirm__button-box">
                        <div className="confirm__button" onClick={x => callback(false)}>{t('button.ok')}</div>
                    </div>
                </div>
            </div> 
        </>
    )
}

export default InfoBox;