import React, { createContext, useContext, useState, useCallback } from 'react';
import CustomAlert from './CustomAlert'; 

const AlertContext = createContext();

// Simple method for getting the alert methods from the context 
export const useAlert = () => useContext(AlertContext);

// Provider of the alert methods
export const AlertProvider = ({ children }) => {
  // State variables
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  /**
   * Function called when displaying the alert
   * @param message message to display
   * @param type type of the alert
   */
  let showAlert = useCallback((message, type) => {
    setAlertMessage(message);
    setAlertType(type)
    setAlertVisible(true);
  }, []);

  /**
   * On close handeler
   */
  let handleAlertClose = () => {
    setAlertVisible(false);
  };

  return (
    <AlertContext.Provider value={{showAlert : showAlert}}>
      {alertVisible && (
        <CustomAlert
          message={alertMessage}
          type={alertType}
          onClose={handleAlertClose}
        />
      )}
      {children}
    </AlertContext.Provider>
  );
};
