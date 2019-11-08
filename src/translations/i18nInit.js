
import Cookies from 'js-cookie';
import langPL from "./pl.json"
import langEN from "./en.json"
import i18next from 'i18next';
import {initReactI18next} from "react-i18next";
import React, { useState, useEffect, state } from "react";

const lang = () => {
    if (Cookies.get('lang')) {
        return Cookies.get('lang')
    }
    else {
        Cookies.set('lang', "en")
        return 'en';
    }
}
const newInstance = i18next.createInstance();



export const i18nInit = () =>{
    newInstance.use(initReactI18next).init({
        interpolation: { escapeValue: false },
        lng: lang(),    
        resources: {
            pl: {
                common: langPL
            },
            en: {
                common: langEN
            },
        },
    });
}

