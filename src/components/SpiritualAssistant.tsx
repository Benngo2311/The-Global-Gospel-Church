import React, { useState, useEffect } from 'react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User, Loader2, BrainCircuit } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

export const SpiritualAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      // Use gemini-3.1-pro-preview for thinking mode as requested
      const model = isThinkingMode ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview';
      
      const systemInstruction = language === 'vi' 
        ? 'Bạn là một trợ lý hỗ trợ và cầu nguyện cho Hội Thánh Quyền Năng Tin Lành Toàn Cầu. Hãy trả lời các câu hỏi về mục vụ, sự kiện, lớp học và tiếp nhận các yêu cầu cầu nguyện một cách nhẹ nhàng, khích lệ và dựa trên nền tảng Kinh Thánh bằng tiếng Việt.'
        : 'You are a support and prayer assistant for The Global Gospel Power Church. Answer questions about the ministry, events, classes, and receive prayer requests in a gentle, encouraging, and biblically-grounded manner in English.';

      const response = await ai.models.generateContent({
        model,
        contents: [...messages, { role: 'user', content: userMessage }].map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        config: { 
          systemInstruction,
          ...(isThinkingMode && {
            thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
          })
        }
      });

      const assistantMessage = response.text || (language === 'vi' ? 'Xin lỗi, tôi không thể trả lời lúc này.' : 'Sorry, I cannot answer right now.');
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: language === 'vi' ? 'Đã xảy ra lỗi khi kết nối với trợ lý.' : 'An error occurred while connecting to the assistant.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-church-red text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] glass rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-church-red text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-sm">
                    {t({ en: 'Support & Prayer', vi: 'Hỗ Trợ & Cầu Nguyện' })}
                  </span>
                  <button 
                    onClick={() => setIsThinkingMode(!isThinkingMode)}
                    className={cn(
                      "flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold transition-colors",
                      isThinkingMode ? "text-church-gold" : "text-white/60"
                    )}
                  >
                    <BrainCircuit size={10} />
                    {isThinkingMode ? t({ en: 'Deep Reasoning ON', vi: 'Chế độ Suy nghĩ Sâu BẬT' }) : t({ en: 'Standard Mode', vi: 'Chế độ Tiêu chuẩn' })}
                  </button>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-10 opacity-50">
                  <Bot size={48} className="mx-auto mb-4" />
                  <p className="text-sm">
                    {t({ 
                      en: 'Hello! How can I support you or pray for you today?', 
                      vi: 'Xin chào! Tôi có thể hỗ trợ hoặc cầu nguyện cho bạn như thế nào hôm nay?' 
                    })}
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', msg.role === 'user' ? 'bg-slate-200' : 'bg-church-red/10 text-church-red')}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={cn('p-3 rounded-2xl text-sm max-w-[80%]', msg.role === 'user' ? 'bg-slate-100' : 'bg-white shadow-sm')}>
                    <div className="markdown-body">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-church-red/10 text-church-red flex items-center justify-center">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white shadow-sm text-sm italic opacity-50">
                    {t({ en: 'Thinking...', vi: 'Đang suy nghĩ...' })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t({ en: 'Ask a question...', vi: 'Đặt câu hỏi...' })}
                  className="flex-grow bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-church-red outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="w-10 h-10 rounded-full bg-church-red text-white flex items-center justify-center hover:bg-red-800 transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
