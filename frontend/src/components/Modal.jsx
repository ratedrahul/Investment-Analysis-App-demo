import React, { useEffect } from "react";

function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "var(--bg-overlay)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-modal)",
          borderRadius: "12px",
          boxShadow: "var(--shadow-modal)",
          width: "100%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          animation: "modalIn 0.2s ease-out",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "sticky",
            top: "0.75rem",
            float: "right",
            marginRight: "0.75rem",
            zIndex: 10,
            width: "32px",
            height: "32px",
            border: "none",
            borderRadius: "50%",
            background: "var(--close-btn-bg)",
            color: "var(--close-btn-color)",
            fontSize: "1.1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          &#x2715;
        </button>
        <div style={{ padding: "2rem" }}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
