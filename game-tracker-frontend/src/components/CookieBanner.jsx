import { useState } from "react";
import "../styles/CookieBanner.css";

function CookieBanner() {
    const [visible, setVisible] = useState(() => {
        return !localStorage.getItem("cookiesAccepted");
    });

    if (!visible) return null;

    const handleAccept = () => {
        localStorage.setItem("cookiesAccepted", "true");
        setVisible(false);
    };

    const handleRefuse = () => {
        localStorage.setItem("cookiesAccepted", "false");
        setVisible(false);
    };

    return (
        <div className="cookie-banner">
            <p>Ce site utilise des cookies pour améliorer votre expérience. En continuant, vous acceptez leur utilisation.</p>
            <div className="cookie-buttons">
                <button className="cookie-refuse" onClick={handleRefuse}>Refuser</button>
                <button className="cookie-accept" onClick={handleAccept}>Accepter</button>
            </div>
        </div>
    );
}

export default CookieBanner;