import React, { useState, useEffect, state } from "react";

import { useTranslation } from 'react-i18next';

const RemoveBox = ({ txt, callback }) => {
    const { t, i18n } = useTranslation('common');
    return (
        <>
            <div className="confirm__background" />
            <div className="confirm__box">
                <div className="confirm__content">
                    <div className="confirm__txt">{txt}</div>
                    <div className="confirm__button-box">
                        <div className="confirm__button confirm__button--red" onClick={x => callback(true)}>{t('button.remove')}</div>
                        <div className="confirm__button" onClick={x => callback(false)}>{t('button.cancel')}</div>
                    </div>
                </div>
            </div> 
        </>
    )
}

export default RemoveBox;