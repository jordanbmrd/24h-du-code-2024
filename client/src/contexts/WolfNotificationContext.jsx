import { createContext, useContext, useState } from 'react';
import WolfNotification from "../components/layout/WolfNotification.jsx";
import PropTypes from "prop-types";

const WolfNotificationContext = createContext();

export const useWolfNotification = () => useContext(WolfNotificationContext);

export const WolfNotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const sendWolfNotification = (message) => {
        setNotification(message);

        // Clears the notification after 3 seconds
        setTimeout(() => {
            setNotification(null);
        }, 10000);
    };

    return (
        <WolfNotificationContext.Provider value={{ notification, sendWolfNotification }}>
            {children}
            {notification ? (
                <WolfNotification message={notification} />
            ) : null}
        </WolfNotificationContext.Provider>
    );
};

WolfNotificationProvider.propTypes = {
    children: PropTypes.node.isRequired,
};