import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

function AskAI() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'হ্যালো! রক্তদান সম্পর্কে যেকোনো প্রশ্ন করুন।\n\nHello! Ask me anything about blood donation.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function askGroq(userMessage) {
    setLoading(true)
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful blood donation assistant for BloodLink. Answer questions in the same language the user writes in — if they write in Bangla, reply in Bangla; if they write in English, reply in English. Only answer questions related to blood donation, eligibility, blood types, donation process, and related health topics. Keep answers short and clear.'
            },
            { role: 'user', content: userMessage }
          ]
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.choices[0].message.content }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, something went wrong. Please try again.' }])
    }
    setLoading(false)
  }

  function sendMessage() {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text }])
    askGroq(text)
  }

  function sendChip(text) {
    setMessages(prev => [...prev, { role: 'user', text }])
    askGroq(text)
  }

  function handleKey(e) {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="askai-body">
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1>QnA about Blood Donation</h1>
          <p>Blood related awareness and QnA answering AI assistance</p>
        </div>

        <div className="chat-container">
          <div className="chat-header">
            <span className="chat-avatar">🩸</span>
            <div>
              <h3>Blood Donation Assistant</h3>
              <p>Available 24/7 to answer your questions</p>
            </div>
            <div className="chat-status">
              <div className="status-dot"></div>
              Online
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              msg.role === 'ai' ? (
                <div key={i} className="msg-ai">
                  <span className="msg-avatar">🩸</span>
                  <div className="msg-bubble" style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                </div>
              ) : (
                <div key={i} className="msg-user">
                  <div className="msg-user-bubble">{msg.text}</div>
                </div>
              )
            ))}
            {loading && (
              <div className="msg-ai">
                <span className="msg-avatar">🩸</span>
                <div className="msg-bubble">...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chips-area">
            {['Eligibility criteria', 'Blood types', 'Donation process', 'After donation care', 'Find blood drives'].map(chip => (
              <button key={chip} className="chip" onClick={() => sendChip(chip)}>{chip}</button>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Type your question here..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="send-btn" onClick={sendMessage}>➤</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AskAI
