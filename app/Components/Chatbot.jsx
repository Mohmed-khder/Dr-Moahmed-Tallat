"use client";
import React, { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { FiSend, FiX } from "react-icons/fi";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { trackMetaCustomEvent } from "../lib/tracking";

const Chatbot = () => {
  const t = useTranslations("chatbot");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleChat = () => {
    if (!isOpen) {
      trackMetaCustomEvent("AIAssistantClick", {
        assistant_type: "floating_chatbot",
      });
    }
    setIsOpen(!isOpen);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isTyping) return;

    const userText = newMessage.trim();
    const updatedMessages = [...messages, { role: "user", content: userText }];
    setMessages(updatedMessages);
    setNewMessage("");
    setIsTyping(true);

    try {
      const response = await fetch(
        "https://phplaravel-1599200-6319906.cloudwaysapps.com/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            message: userText,
            history: updatedMessages.slice(0, -1),
          }),
        },
      );

      const data = await response.json();

      if (data.status) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message || t("error") },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("connectionError") },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatMessage = (text) => {
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div
      className={`fixed bottom-6 ${isRTL ? "left-6" : "right-6"} z-9999 font-['Cairo']`}
    >
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none z-10000 relative overflow-hidden"
      >
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${
            isOpen ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
          }`}
        >
          <FiX className="w-8 h-8" />
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${
            isOpen ? "-rotate-90 opacity-0" : "rotate-0 opacity-100"
          }`}
        >
          <HiChatBubbleLeftRight className="w-8 h-8" />
        </div>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 ${isRTL ? "left-6" : "right-6"} w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden  border border-gray-100 transition-all duration-300 ease-out transform ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100 pointer-events-auto"
            : "translate-y-10 scale-95 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-primary px-5 py-4 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary font-black text-xl">
                ط
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full"></span>
            </div>
            <div>
              <h3 className="text-white font-black text-lg leading-tight">
                {t("title")}
              </h3>
              {/* <p className="text-gold/80 text-xs font-bold">{t("subtitle")}</p> */}
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="text-white/70 hover:text-white transition-colors focus:outline-none"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 overflow-x-hidden flex flex-col gap-4">
          {/* Welcome Message */}
          <div className="flex justify-start">
            <div className="bg-white text-baseTwo px-4 py-3 rounded-2xl rounded-tr-none shadow-sm border border-gray-100 max-w-[85%] text-sm font-semibold leading-relaxed">
              {t("welcome")}
            </div>
          </div>

          {/* Messages Mapping */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
            >
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm max-w-[85%] text-sm font-semibold leading-relaxed transition-all duration-300 ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-tl-none"
                    : "bg-white text-baseTwo rounded-tr-none border border-gray-100"
                }`}
              >
                {formatMessage(msg.content)}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tr-none shadow-sm border border-gray-200 flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                <span
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 relative"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t("placeholder")}
              className={`flex-1 bg-gray-50 border border-gray-200 outline-none text-baseTwo text-sm rounded-xl focus:ring-primary focus:border-primary block w-full p-3 ${
                isRTL ? "pl-12" : "pr-12"
              } font-semibold transition-all`}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isTyping}
              className={`absolute ${isRTL ? "left-2" : "right-2"} top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FiSend className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
