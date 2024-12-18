import React from "react";
import "../../styles/DeleteWithConfirmation.css";

export default function ConfirmationPopup({
  isOpen,
  onClose,
  onConfirm,
  type,
}) {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="popup">
        <p className="popup-message">
          Are you sure you want to delete this {type}?
        </p>
        <div className="button-container">
          <button
            //   style={styles.confirmButton}
            onClick={onConfirm}
            className="btn-primary btn"
          >
            Yes
          </button>
          <button onClick={onClose} className="btn-secondary btn">
            No
          </button>
        </div>
      </div>
    </div>
  );
}
