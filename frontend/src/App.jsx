import { useState, useRef, useEffect } from 'react'

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '🩺 Hello! I\'m your medical symptom assistant. Describe your symptoms (e.g., "headache, fever, cough") and I\'ll suggest possible conditions. Remember to consult a doctor for proper diagnosis.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '⚠️ Couldn\'t reach server. Please ensure backend is running on port 8000.' 
      }])
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <header className="text-center py-3 mb-2">
        <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <span>🩺</span> Medical Symptom Assistant
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-white/5 rounded-xl mb-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-emerald-900/50 text-gray-100 border border-emerald-700/50'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-3 rounded-xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your symptoms..."
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-500 border border-white/10 focus:outline-none focus:border-emerald-500 transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-medium rounded-xl transition-colors"
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>

      <p className="text-center text-gray-600 text-xs mt-2">
        ⚠️ For educational purposes only. Always consult a medical professional.
      </p>
    </div>
  )
}

export default App