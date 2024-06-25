import React, { useEffect } from 'react';
import './CustomAlert.scss'

/**
 * Custom alert component to replace default alert()
 * 
 * @param {String} message message to display
 * @param {Function} onClose behaviour for closing the alert 
 * @param {String} type the type of the alert, determines color 
 * @returns 
 */
function CustomAlert({ message, onClose, type }) {
    // Simple mapping from alert type to css class 
    const colors = {
        'success' : 'custom_success',
        'warning' : 'custom_warning',
        'error' : 'custom_error',
        'primary' : 'custom_primary'
    }

    // Get alert type, primary by default
    const alertType = colors[type] || 'custom_primary';

    // Timeout of 5 seconds for the alert
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
      <div className={`custom_alert ${alertType}`} role="alert">
        {message}
        <button type="button" className="close" onClick={onClose} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }

export default CustomAlert;