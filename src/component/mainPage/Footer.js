import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {

    return (
        <div className="footer">
            <ul className="footer__social-position">
                <li className="footer__social-position--element"><a className="footer__soc footer__soc--linkedin" href="https://www.linkedin.com/in/michal-kostorz" ></a></li>
                <li className="footer__social-position--element"><a className="footer__soc footer__soc--githube" href="https://github.com/Michalk001" ></a></li>
            </ul>
        </div>

    )
}

export default Footer;