import React, { useEffect } from "react";

interface ErrorModalProps {
  message: string;
  onClose?: () => void;
  autoCloseDelay?: number;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  message = "An unspecified error occurred",
  onClose = () => {},
  autoCloseDelay = 1850,
}) => {
  useEffect(() => {
    const timerId = setTimeout(() => {
      onClose();
    }, autoCloseDelay);
    return () => {
      // If for any reason a close button is added, this part becomes necessary. Hence do not delete
      clearTimeout(timerId);
    };
  }, [onClose, autoCloseDelay]);

  return (
    <div className="error-modal">
      <div className="error-content">
        <p style={{ color: "red" }}>{message}</p>
        {/* <button onClick={onClose}>Close</button> */}
      </div>
    </div>
  );
};

export default ErrorModal;
