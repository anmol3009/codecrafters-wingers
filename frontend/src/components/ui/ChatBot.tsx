import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

// Parse "[text](/path)" markdown links into React elements
function renderMessage(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (match) {
      return (
        <Link
          key={i}
          to={match[2]}
          className="font-bold underline underline-offset-2 hover:opacity-70 transition-opacity"
        >
          {match[1]}
        </Link>
      )
    }
    return <span key={i}>{part}</span>
  })
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m the SARASWATI Assistant 👋 Ask me anything about the platform — courses, quizzes, your learning path, or anything else!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const { reply } = await api.chat.send(
        next.map(m => ({ role: m.role, content: m.content }))
      )
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble connecting. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-[360px] bg-white border-2 border-[#111] flex flex-col overflow-hidden"
            style={{ height: '480px', boxShadow: '6px 6px 0 #111' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#FFCBA4] border-b-2 border-[#111] flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#111] flex items-center justify-center">
                  <span className="text-[#FFCBA4] text-xs font-bold">AI</span>
                </div>
                <div>
                  <p className="font-display text-[#111] font-bold text-sm leading-tight">SARASWATI Assistant</p>
                  <p className="font-body text-[#111]/60 text-xs">Powered by Groq</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 border-2 border-[#111] bg-white flex items-center justify-center hover:bg-[#111] hover:text-white transition-colors"
                style={{ boxShadow: '2px 2px 0 #111' }}
              >
                <span className="text-sm font-bold leading-none">×</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 border border-[#111] font-body text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-[#FFCBA4] text-[#111]'
                        : 'bg-white text-[#111]'
                    }`}
                    style={{ boxShadow: '2px 2px 0 #111' }}
                  >
                    {renderMessage(msg.content)}
                  </div>
                </div>
              ))}

              {/* Loading dots */}
              {loading && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3 border border-[#111] bg-white"
                    style={{ boxShadow: '2px 2px 0 #111' }}
                  >
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-[#111] rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 border-t-2 border-[#111] flex">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything…"
                disabled={loading}
                className="flex-1 px-4 py-3 font-body text-sm text-[#111] placeholder:text-[#999] outline-none bg-white disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-3 bg-[#FFCBA4] border-l-2 border-[#111] font-body font-bold text-sm text-[#111] hover:bg-[#f0b88a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(v => !v)}
        className="w-16 h-16 rounded-full bg-[#00BCD4] border-2 border-[#111] flex items-center justify-center overflow-hidden"
        style={{ boxShadow: '4px 4px 0 #111' }}
        whileHover={{ scale: 1.08, boxShadow: '6px 6px 0 #111' }}
        whileTap={{ scale: 0.95, boxShadow: '2px 2px 0 #111' }}
        transition={{ duration: 0.1 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-white text-2xl font-bold leading-none"
            >
              ×
            </motion.span>
          ) : (
            <motion.span
              key="bot"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-3xl"
            >
              🤖
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

