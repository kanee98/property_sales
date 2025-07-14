import React, { createContext, useContext, useState, ReactNode } from "react";
import './dashboard.css';

type MessageContextType = {
  showMessage: (message: string) => void;
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const showMessage = (message: string) => {
    setModalMessage(message);
    setIsMessageModalOpen(true);
    setIsFadingOut(false);

    setTimeout(() => setIsFadingOut(true), 2500);
    setTimeout(() => {
      setIsMessageModalOpen(false);
      setModalMessage(null);
      setIsFadingOut(false);
    }, 3000);
  };

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}

      {isMessageModalOpen && (
        <div className={`message-box ${isFadingOut ? "fade-out" : ""}`}>
            {modalMessage}
        </div>
      )}
    </MessageContext.Provider>
  );
};