'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, User, Bot, LogOut, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vs as syntaxTheme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Message } from '@/types/chat'
import { User as FirebaseUser } from 'firebase/auth'

const useLineByLineAnimation = (text: string, speed: number = 500) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!text) return

    const lines = text.split('\n')
    setDisplayedLines([])
    setIsComplete(false)
    let lineIndex = 0

    const timer = setInterval(() => {
      if (lineIndex < lines.length) {
        setDisplayedLines(prev => [...prev, lines[lineIndex]])
        lineIndex++
      } else {
        setIsComplete(true)
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return { 
    displayedText: displayedLines.join('\n'), 
    isComplete,
    currentLineCount: displayedLines.length,
    displayedLines
  }
}

const AnimatedMessage = ({ content, isLatest }: { content: string; isLatest: boolean }) => {
  const { displayedText, isComplete, displayedLines } = useLineByLineAnimation(isLatest ? content : content, 400)
  
  if (!isLatest) {
    return (
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '')
              const isInline = !props.node || props.node.position?.start.line === props.node.position?.end.line
              
              return !isInline && match ? (
                <SyntaxHighlighter
                  style={syntaxTheme as any}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-md my-2"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-200/60 px-1 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              )
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    )
  }

  const allLines = content.split('\n')
  
  return (
    <div className="prose prose-sm max-w-none">
      {allLines.map((line, index) => {
        const isVisible = index < displayedLines.length
        const isJustAppeared = index === displayedLines.length - 1
        
        return (
          <div
            key={index}
            className={`transition-all duration-500 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-2'
            } ${isJustAppeared ? 'animate-fade-in' : ''}`}
            style={{
              transitionDelay: isVisible ? '0ms' : `${index * 50}ms`
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  const isInline = !props.node || props.node.position?.start.line === props.node.position?.end.line
                  
                  return !isInline && match ? (
                    <SyntaxHighlighter
                      style={syntaxTheme as any}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-md my-2"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-200/60 px-1 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {line || ' '}
            </ReactMarkdown>
          </div>
        )
      })}
      {!isComplete && (
        <div className="flex items-center mt-2 animate-fade-in">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse ml-1" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse ml-1" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}
    </div>
  )
}

interface ChatInterfaceProps {
  className?: string
  user: FirebaseUser | null
  onSignOut: () => void
}

export default function ChatInterface({ className = '', user, onSignOut }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [latestAiMessageId, setLatestAiMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setLatestAiMessageId(assistantMessage.id)
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleStartChat = () => {
    textareaRef.current?.focus()
  }

  if (messages.length === 0) {
    return (
      <div className={`flex flex-col h-full bg-white/15 backdrop-blur-3xl overflow-hidden ${className}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 bg-white/10 backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-lg shadow-sm rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Copilot</h1>
          </div>
          {user && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30">
                <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-700" />
                </div>
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user.email}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="p-2 rounded-xl hover:bg-white/20 backdrop-blur-sm transition-all duration-200 text-gray-600 hover:text-red-500"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-center max-w-2xl px-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Welcome to Propilot
            </h2>
          </div>
        </div>
        
        <div className="border-t border-white/20 px-4 py-4 bg-white/10 backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="w-full resize-none bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl px-6 py-4 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none max-h-32 min-h-[56px]"
                rows={1}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 btn-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl p-4 hover:scale-105 transform transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full bg-white/15 backdrop-blur-3xl overflow-hidden ${className}`}>
       <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 bg-white/10 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-lg shadow-sm rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Copilot</h1>
        </div>
        {user && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-2 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30">
              <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-700" />
              </div>
              <span className="text-sm text-gray-600 hidden sm:block">
                {user.email}
              </span>
            </div>
            <button
              onClick={onSignOut}
              className="p-2 rounded-xl hover:bg-white/20 backdrop-blur-sm transition-all duration-200 text-gray-600 hover:text-red-500"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-4 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-lg shadow-sm rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-gray-700" />
              </div>
            )}
            
            <div
              className={`max-w-3xl rounded-2xl px-6 py-4 ${
                message.role === 'user'
                  ? 'message-user ml-12'
                  : 'message-assistant'
              }`}
            >
              {message.role === 'assistant' ? (
                <AnimatedMessage 
                  content={message.content} 
                  isLatest={message.id === latestAiMessageId}
                />
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-lg shadow-sm rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-700" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-lg shadow-sm rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-gray-700" />
            </div>
            <div className="message-assistant rounded-2xl px-6 py-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                <span className="text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/20 px-4 py-4 bg-white/10 backdrop-blur-2xl">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="w-full resize-none bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl px-6 py-4 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none max-h-32 min-h-[56px]"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 btn-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl p-4 hover:scale-105 transform transition-all duration-200"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
