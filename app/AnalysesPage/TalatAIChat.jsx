import React, { useState, useRef, useEffect } from "react";
import { HiSparkles, HiOutlinePaperAirplane, HiX, HiChevronDown } from "react-icons/hi";
import { askTalatAI } from "../../app/lib/server-api";
import { trackMetaCustomEvent } from "../../app/lib/tracking";


const TalatAIChat = ({ articleId, articleTitle, isRTL }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: isRTL
        ? `يا هلا بك! قرأت مقال "<span class="text-primary font-black">${articleTitle}</span>" وأنا مستعد أجاوب على أي سؤال يخطر في بالك عنه طال عمرك. تفضل اسأل؟`
        : `Welcome! I've read the article "<span class="text-primary font-black">${articleTitle}</span>" and I'm ready to answer any questions you might have. Feel free to ask!`,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);


  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !articleId) return;

    const userText = newMessage;
    const currentMessages = [...messages];

    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setNewMessage("");
    setIsTyping(true);

    try {
      const history = currentMessages.slice(1).map((m) => ({
        role: m.role,
        content: m.content.replace(/<[^>]*>?/gm, ""), // strip html tags for history
      }));

      const data = await askTalatAI(articleId, userText, history);

      if (data && data.status) {

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: isRTL
              ? data.message || "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى."
              : data.message || "Sorry, an error occurred. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isRTL
            ? "عذراً، لا يمكنني الاتصال بالخادم الآن."
            : "Sorry, I cannot connect to the server right now.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          trackMetaCustomEvent("AIAssistantClick", {
            assistant_type: "article_chat",
            article_id: articleId,
          });
          setIsOpen(true);
        }}
        className="mt-6 w-full group relative overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-3xl  shadow-sm hover:shadow-lg transition-all duration-300"
      >
        <div className="bg-white rounded-[1.4rem] px-4 py-4 flex items-center justify-between transition-colors group-hover:bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12  bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
              <HiSparkles size={24} className="animate-pulse" />
            </div>
            <div className={`text-start ${isRTL ? "font-['Cairo']" : ""}`}>
              <h3 className="text-primary font-black text-md md:text-lg leading-none mb-1 group-hover:text-baseTwo transition-colors">
                {isRTL ? "ابدأ المحادثة مع الذكاء الاصطناعي" : "Start AI Chat"}
              </h3>
              <p className="text-slate-500 mt-1 text-xs md:text-sm font-bold truncate max-w-[200px] md:max-w-md">
                {isRTL ? "اسأل Talat AI حول هذا المقال" : "Ask Talat AI about this article"}
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <HiChevronDown size={20} />
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="mt-8 border border-primary/20 bg-white rounded-[2rem] overflow-hidden shadow-xl flex flex-col font-['Cairo'] animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="bg-primary/5 px-6 py-5 flex items-center justify-between border-b border-primary/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm border border-primary/10">
            <HiSparkles size={24} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-primary font-black text-lg leading-tight mb-1">
              {isRTL ? "المساعد الذكي Talat AI" : "Talat AI Smart Assistant"}
            </h3>
            <p className="text-slate-500 text-xs font-bold truncate max-w-[150px] sm:max-w-xs md:max-w-[300px]">
              {isRTL ? `حول: ${articleTitle}` : `About: ${articleTitle}`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          title={isRTL ? "إغلاق" : "Close"}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 transition-colors shadow-sm"
        >
          <HiX size={20} />
        </button>
      </div>

      {/* Chat Area */}

      <div 
        ref={chatContainerRef}
        className="flex-1 p-5 overflow-y-auto bg-slate-50/50 flex flex-col gap-4 max-h-[450px] min-h-[350px] custom-scrollbar"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-5 py-3.5 rounded-2xl max-w-[85%] text-sm font-bold leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-primary text-white rtl:rounded-tl-none ltr:rounded-tr-none"
                  : "bg-white text-slate-800 border border-slate-100 rtl:rounded-tr-none ltr:rounded-tl-none"
              }`}
              dangerouslySetInnerHTML={{
                __html: msg.content.replace(/\n/g, "<br>"),
              }}
            ></div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-5 py-4 rounded-2xl rtl:rounded-tr-none ltr:rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></span>
              <span
                className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                style={{ animationDelay: "0.15s" }}
              ></span>
              <span
                className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              ></span>
            </div>
          </div>
        )}
      </div>


      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-2 relative"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              isRTL
                ? "اسأل عن أي شيء في المقال..."
                : "Ask anything about the article..."
            }
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-primary focus:border-primary block w-full p-4 rtl:pl-14 ltr:pr-14 font-bold transition-all outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isTyping}
            className={`absolute ${
              isRTL ? "left-2" : "right-2"
            } top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <HiOutlinePaperAirplane
              size={20}
              className={isRTL ? "rotate-180" : "rotate-0"}
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TalatAIChat;
