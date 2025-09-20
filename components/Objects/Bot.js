import React, { useState } from "react";
import styled from "styled-components";
import ReactMarkdown from 'react-markdown';
import { API_ENDPOINTS } from "../../components/backend/apiHelper";
import { useNextStep } from 'nextstepjs';
import html2canvas from "html2canvas";


import {
  BotRules,
  MainDashboardUsageGuide,
  CollectorCCUsageGuide,
  BISBorrowerProfileUsageGuide,
  UserAccessManagementUsageGuide,
  ManagementDirectoryUsageGuide,
  SystemConfigurationUsageGuide,
  SystemRequestsUsageGuide,
  IRSUploadPageUsageGuide,
} from "../../utils/precontext";

import {
  FloatingChatButton,
  ChatContainer,
  ChatHeader,
  ChatMessages,
  Message,
  QuickChoices,
  ChoiceButton,
} from "./BotStyled";

const Bot = ({ isDarkMode = false, userId }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { startNextStep } = useNextStep();

  const QUICK_CHOICES = [
    "Take a Guided Tour",
    "Main Dashboard Usage",
    "System Configuration Page Usage",
    "System Requests Page Usage",
    "Management Directory Usage",
    "Collector Command Center",
    "BIS Borrower Profile Help",
    "User Access Management",
    "Masterlist Upload Page Usage",
  ];

  const CHAT_GUIDES = {
    "Main Dashboard Usage Guide": MainDashboardUsageGuide,
    "System Configuration Page Usage Guide": SystemConfigurationUsageGuide,
    "MasterList Upload Page Usage Guide": IRSUploadPageUsageGuide,
    "System Requests Page Usage Guide": SystemRequestsUsageGuide,
    "Management Directory Usage Guide": ManagementDirectoryUsageGuide,
    "Collector Command Center Guide": CollectorCCUsageGuide,
    "BIS Borrower Profile Help": BISBorrowerProfileUsageGuide,
    "User Access Management": UserAccessManagementUsageGuide,
  };

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setChatMessages([
        {
          text: "Hi! I'm AGILA!. Ask me anything about using the system. For quick choices, click the buttons below.",
          isBot: true,
        },
      ]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("Image must be less than 4MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage({
        base64: reader.result.split(",")[1],
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const sendMessageToGemini = async (inputText) => {
    setIsLoading(true);
    const lowerInput = inputText.toLowerCase();
    const shouldStartTour = lowerInput.includes("guide") || lowerInput.includes("tour");
  
    try {
      let response;
  
      // 📸 Screenshot if message mentions "my screen"
      if (lowerInput.includes("my screen")) {
        try {
          const bodyRect = document.body.getBoundingClientRect();
  
          if (bodyRect.width === 0 || bodyRect.height === 0) {
            throw new Error("Page is empty or not rendered.");
          }
  
          const canvas = await html2canvas(document.body, { scale: 0.5 });
          if (canvas.width === 0 || canvas.height === 0) {
            throw new Error("Canvas is empty.");
          }
  
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.5);
          const base64image = compressedDataUrl.split(",")[1];
  
          setChatMessages((prev) => [
            ...prev,
            {
              text: inputText,
              isBot: false,
              image: `data:image/jpeg;base64,${base64image}`,
            },
          ]);
  
          const body = {
            userId,
            contents: [
              {
                role: "user",
                parts: [
                  {
                    inlineData: {
                      data: base64image,
                      mimeType: "image/jpeg",
                    },
                  },
                  {
                    text: inputText,
                  },
                ],
              },
            ],
          };
  
          response = await fetch(API_ENDPOINTS.SEND_IMAGE_MESSAGE_TO_AGILA, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        } catch (screenshotError) {
          console.warn("Screenshot failed:", screenshotError.message);
          setChatMessages((prev) => [
            ...prev,
            {
              text: "Sorry, I couldn't capture your screen. Make sure you're on a page with visible content.",
              isBot: true,
            },
          ]);
          return;
        }
  
      } else if (selectedImage) {
        // 📎 Upload image from file picker
        setChatMessages((prev) => [
          ...prev,
          {
            text: inputText || "(sent an image)",
            isBot: false,
            image: `data:${selectedImage.mimeType};base64,${selectedImage.base64}`,
          },
        ]);
  
        const body = {
          userId,
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    data: selectedImage.base64,
                    mimeType: selectedImage.mimeType,
                  },
                },
                {
                  text: inputText || "What’s in this image?",
                },
              ],
            },
          ],
        };
  
        response = await fetch(API_ENDPOINTS.SEND_IMAGE_MESSAGE_TO_AGILA, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
  
      } else {
        // 💬 Plain text message
        setChatMessages((prev) => [
          ...prev,
          { text: inputText, isBot: false },
        ]);
  
        response = await fetch(API_ENDPOINTS.SEND_MESSAGE_TO_AGILA, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userMessage: inputText, userId }),
        });
      }
  
      // 🧭 Trigger guided tour if applicable
      if (shouldStartTour) {
        startNextStep("mainTour");
        setChatMessages((prev) => [
          ...prev,
          { text: "Launching the guided tour now. 👇", isBot: true },
        ]);
      }
  
      // 🤖 Handle Gemini response
      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const textPart = parts.find((p) => p.text)?.text || "Sorry, I didn't get that.";
      const imagePart = parts.find((p) => p.inlineData?.data);
  
      const botReply = {
        text: textPart,
        isBot: true,
      };
  
      if (imagePart) {
        botReply.image = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      }
  
      setChatMessages((prev) => [...prev, botReply]);
  
    } catch (error) {
      console.error("Gemini error:", error);
      setChatMessages((prev) => [
        ...prev,
        { text: "Sorry, something went wrong.", isBot: true },
      ]);
    } finally {
      setIsLoading(false);
      setUserInput("");
      setSelectedImage(null);
    }
  };
  
  

  const handleSend = () => {
    if (userInput.trim() !== "" || selectedImage) {
      sendMessageToGemini(userInput.trim());
    }
  };

  const handleChoiceClick = (choice) => {
    if (choice === "Take a Guided Tour") {
      startNextStep("mainTour");
      setChatMessages((prev) => [
        ...prev,
        { text: choice, isBot: false },
        { text: "Launching the guided tour now. 👇", isBot: true },
      ]);
    } else {
      sendMessageToGemini(`Give help about: ${choice}`);
    }
  };

  return (
    <>
      <FloatingChatButton onClick={handleChatToggle} isDarkMode={isDarkMode}>
        {isChatOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <img src="/assets/agila.png" alt="AGILA Bot" />
        )}
      </FloatingChatButton>

      <ChatContainer isOpen={isChatOpen} isDarkMode={isDarkMode}>
        <ChatHeader isDarkMode={isDarkMode}>
          <h3>Agila</h3>
          <button onClick={handleChatToggle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </ChatHeader>

        <ChatMessages isDarkMode={isDarkMode}>
          {chatMessages.map((msg, idx) => (
            <Message key={idx} isBot={msg.isBot} isDarkMode={isDarkMode}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
              {msg.image && (
                <img
                  src={msg.image}
                  alt={msg.isBot ? "AGILA response image" : "User sent image"}
                  style={{
                    marginTop: "0.5rem",
                    maxWidth: "100%",
                    maxHeight: "200px",
                    borderRadius: "6px",
                    objectFit: "contain",
                  }}
                />
              )}
            </Message>
          ))}
          {isLoading && <Message isBot={true} isDarkMode={isDarkMode}>Agila is typing...</Message>}
        </ChatMessages>

        <div style={{ display: "flex", alignItems: "center", padding: "0.75rem", borderTop: `1px solid ${isDarkMode ? '#333' : '#e5e7eb'}` }}>
          <input
            type="file"
            accept="image/*"
            id="agila-upload"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <label
          htmlFor="agila-upload"
          title="Upload screenshot or image"
          style={{
            marginRight: "0.5rem",
            cursor: "pointer",
            fontSize: "1rem",
            color: isDarkMode ? "#f3f4f6" : "#4b5563",
            display: "inline-flex",
            alignItems: "center",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.375rem",
            transition: "background-color 0.2s ease",
            backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode ? "#374151" : "#e5e7eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode ? "#1f2937" : "#f9fafb";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 24 24"
            style={{ marginRight: "0.25rem" }}
          >
            <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13l2.5 3.01L14.5 11l4.5 6H5l3.5-4zM14 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          </svg>
          
        </label>

          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your question..."
            style={{
              flexGrow: 1,
              padding: "0.5rem",
              borderRadius: "8px",
              border: `1px solid ${isDarkMode ? "#404040" : "#d1d5db"}`,
              background: isDarkMode ? "#1f1f1f" : "#fff",
              color: isDarkMode ? "#f3f4f6" : "#111",
            }}
          />
          <button
            onClick={handleSend}
            style={{
              marginLeft: "0.5rem",
              background: isDarkMode ? "#ff840b" : "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>

        {selectedImage && (
          <div style={{
            position: "relative",
            margin: "0.75rem",
            padding: "0.5rem",
            borderRadius: "8px",
            background: isDarkMode ? "#2a2a2a" : "#f3f4f6",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            display: "inline-block",
            maxWidth: "300px"
          }}>
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                background: "transparent",
                border: "none",
                color: isDarkMode ? "#f87171" : "#e11d48",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1rem",
                lineHeight: "1",
              }}
              aria-label="Remove image"
            >
              ×
            </button>
            <img
              src={`data:${selectedImage.mimeType};base64,${selectedImage.base64}`}
              alt="Selected preview"
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "200px",
                borderRadius: "6px",
                objectFit: "contain"
              }}
            />
            <p style={{ fontSize: "0.75rem", marginTop: "0.5rem", color: isDarkMode ? "#ccc" : "#555" }}>
              Image ready to send
            </p>
          </div>
        )}

        <QuickChoices isDarkMode={isDarkMode}>
          {QUICK_CHOICES.map((choice, idx) => (
            <ChoiceButton
              key={idx}
              onClick={() => handleChoiceClick(choice)}
              isDarkMode={isDarkMode}
            >
              {choice}
            </ChoiceButton>
          ))}
        </QuickChoices>
      </ChatContainer>
    </>
  );
};

export default Bot;
