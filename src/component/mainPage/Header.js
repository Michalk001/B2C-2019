import React, { useState, useEffect, useContext, state } from "react";
import {
  Link

} from 'react-router-dom';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from "../../context/AuthContext";

const Header = () => {
  const { t, i18n } = useTranslation('common');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [singOut, setSingOut] = useState(false);

  const { isLogin, onLogout, isAdmin } = useContext(AuthContext);



  const SingOut = () => {

    Cookies.remove('token', { path: '/' })
    Cookies.remove('firstName', { path: '/' })
    Cookies.remove('lastName', { path: '/' })
    Cookies.remove('id', { path: '/' })
    onLogout();
    setSingOut(true);

  }


  return (
    <>
      {singOut && <Redirect to="/" />}
      <div className="header">
        <ul className="classic-menu classic-menu--lang">
          <li className="classic-menu__element">
            {!Cookies.get('lang') || Cookies.get('lang') == "pl" && <div className="lang-button" onClick={() => { i18n.changeLanguage('en'); Cookies.set('lang', "en") }}>English</div>}
            {Cookies.get('lang') && Cookies.get('lang') == "en" && <div className="lang-button" onClick={() => { i18n.changeLanguage('pl'); Cookies.set('lang', "pl") }}>Polski</div>}
          </li>
        </ul>
        <ul className="classic-menu">

          {isLogin && isAdmin && <li className="classic-menu__element">
            <Link className="classic-menu__link" to="/management">{t('common.adminPanel')}</Link>
          </li>}
          <li className="classic-menu__element">
            {isLogin && <Link className="classic-menu__link" to={`/employee/${Cookies.get('id')}`} >{t('common.userPanel')}</Link>}

          </li>
          <li className="classic-menu__element">
            {isLogin && <Link className="classic-menu__link" to={`/employee/${Cookies.get('id')}`} >{Cookies.get('firstName')} {Cookies.get('lastName')}</Link>}
            {!isLogin && <Link className="classic-menu__link" to="/login">{t('common.singUp')}</Link>}
          </li>
          <li className="classic-menu__element">
            {isLogin && <a className="classic-menu__link" onClick={x => SingOut()} >{t('common.singOut')}</a>}

          </li>

        </ul>
        <div className="hamburger">
          <div className="hamburger__button" onClick={x => { isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true) }}>
            <div className={`hamburger__bars ${isMenuOpen ? 'hamburger__bars--top-active' : ""}`}></div>
            <div className={`hamburger__bars hamburger__bars--middle ${isMenuOpen ? 'hamburger__bars--middle-active' : ""}`}></div>
            <div className={`hamburger__bars hamburger__bars--bottom ${isMenuOpen ? 'hamburger__bars--bottom-active' : ""}`}></div>
          </div>
          <div className={`hamburger__menu ${isMenuOpen ? 'hamburger__menu--active' : ""}`} >
            <ul className="hamburger__menu-lista">
              <li className="hamburger__menu-element">
                {isLogin && <Link onClick={x => setIsMenuOpen(false)} className="hamburger__menu-link" to={`/employee/${Cookies.get('id')}`}>{Cookies.get('firstName')} {Cookies.get('secondName')}</Link>}
                {!isLogin && <Link onClick={x => setIsMenuOpen(false)} className="hamburger__menu-link" to="/login">{t('common.singUp')}</Link>}
              </li>
              {isLogin && isAdmin && <li className="hamburger__menu-element">
                <Link className="hamburger__menu-link" to={`/management`} onClick={x => setIsMenuOpen(false)}>{t('common.adminPanel')}</Link>
              </li>}
              <li className="hamburger__menu-element" >
                {isLogin && <Link onClick={x => setIsMenuOpen(false)} className="hamburger__menu-link" to={`/employee/${Cookies.get('id')}`}>{t('common.userPanel')}</Link>}
              </li>
              <li className="hamburger__menu-element" >
                {isLogin && <div onClick={x => setIsMenuOpen(false)} className="hamburger__menu-link" onClick={x => SingOut()} >{t('common.singOut')}</div>}
              </li>
              <li className="hamburger__menu-element">
                {!Cookies.get('lang') || Cookies.get('lang') == "pl" && <div className="hamburger__menu-link" onClick={() => { i18n.changeLanguage('en'); Cookies.set('lang', "en") }}>English</div>}
                {Cookies.get('lang') && Cookies.get('lang') == "en" && <div className="hamburger__menu-link" onClick={() => { i18n.changeLanguage('pl'); Cookies.set('lang', "pl") }}>Polski</div>}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header;