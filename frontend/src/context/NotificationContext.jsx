import { createContext, useContext, useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./NotificationContext.css";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const notificationRef = useRef(null);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    const notificationDiv = document.createElement("div");
    notificationRef.current = notificationDiv;
    document.body.appendChild(notificationDiv);

    return () => {
      if (notificationRef.current) {
        document.body.removeChild(notificationRef.current);
      }
    };
  }, []);

  const showNotification = (msg, msgType = "success") => {
    setMessage(msg);
    setType(msgType);

    setTimeout(() => {
      setMessage("");
      setType("");
    }, 3000);
  };

  const contextValue = { showNotification };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {notificationRef.current &&
        ReactDOM.createPortal(
          message && (
            <div className={`notification ${type}`}>
              {message}
            </div>
          ),
          notificationRef.current
        )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
