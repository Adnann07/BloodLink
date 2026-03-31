import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AskAI = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async (e, presetMessage = null) => {
        if (e) e.preventDefault();
        const messageText = presetMessage || input;
        if (!messageText.trim()) return;

        const userMessage = { role: 'user', text: messageText };
        setMessages((prev) => [...prev, userMessage]);
        if (!presetMessage) setInput('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/chat', {
                message: messageText,
            });

            const botMessage = { role: 'bot', text: response.data.reply };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            const errorMessage = { role: 'bot', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        'Eligibility criteria',
        'Blood types',
        'Donation process',
        'After donation care'
    ];

    const handleQuickAction = (action) => {
        sendMessage(null, action);
    };

    const renderMessage = (text) => {
        // Convert markdown-style formatting to HTML
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>')  // Italic
            .replace(/\n\* /g, '<br/>• ')  // Bullet points
            .replace(/\n/g, '<br/>');  // Line breaks
        
        return { __html: formatted };
    };

    return (
        <>
            <Navbar />
            <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.title}>QnA about Blood Donation</h1>
                <p style={styles.subtitle}>Blood related awareness and QnA answering AI assistance</p>
            </div>

            <div style={styles.chatContainer}>
                <div style={styles.chatHeader}>
                    <div style={styles.chatHeaderContent}>
                        <span style={styles.bloodIcon}>🩸</span>
                        <div>
                            <h3 style={styles.chatTitle}>Blood Donation Assistant</h3>
                            <p style={styles.chatSubtitle}>Available 24/7 to answer your questions</p>
                        </div>
                    </div>
                </div>

                <div style={styles.messagesArea}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{
                            ...styles.messageWrapper,
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                        }}>
                            {msg.role === 'bot' && (
                                <div style={styles.botMessage} dangerouslySetInnerHTML={renderMessage(msg.text)} />
                            )}
                            {msg.role === 'user' && (
                                <div style={styles.userMessage}>{msg.text}</div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div style={{ ...styles.messageWrapper, justifyContent: 'flex-start' }}>
                            <div style={styles.botMessage}>Thinking...</div>
                        </div>
                    )}
                </div>

                <div style={styles.quickActions}>
                    {quickActions.map((action) => (
                        <button
                            key={action}
                            onClick={() => handleQuickAction(action)}
                            style={styles.quickActionButton}
                        >
                            {action}
                        </button>
                    ))}
                </div>

                <div style={styles.inputArea}>
                    <form onSubmit={sendMessage} style={styles.inputForm}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question here..."
                            style={styles.input}
                        />
                        <button type="submit" style={styles.sendButton}>Send</button>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        paddingTop: '100px',
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    title: {
        fontSize: '28px',
        fontWeight: '600',
        color: '#333',
        margin: '0 0 10px 0',
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
        margin: 0,
    },
    chatContainer: {
        maxWidth: '700px',
        margin: '0 auto',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden',
    },
    chatHeader: {
        backgroundColor: '#c62828',
        padding: '15px 20px',
    },
    chatHeaderContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    bloodIcon: {
        fontSize: '24px',
    },
    chatTitle: {
        color: '#fff',
        margin: 0,
        fontSize: '16px',
        fontWeight: '600',
    },
    chatSubtitle: {
        color: '#fff',
        margin: '2px 0 0 0',
        fontSize: '12px',
        opacity: 0.9,
    },
    messagesArea: {
        height: '350px',
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: '#fafafa',
    },
    messageWrapper: {
        display: 'flex',
        marginBottom: '15px',
    },
    botMessage: {
        backgroundColor: '#fff',
        padding: '12px 16px',
        borderRadius: '12px',
        maxWidth: '80%',
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#333',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    userMessage: {
        backgroundColor: '#c62828',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '20px',
        fontSize: '14px',
        maxWidth: '80%',
    },
    quickActions: {
        display: 'flex',
        gap: '10px',
        padding: '15px 20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        borderTop: '1px solid #eee',
        backgroundColor: '#fff',
    },
    quickActionButton: {
        padding: '8px 16px',
        border: '1px solid #c62828',
        backgroundColor: '#fff',
        color: '#c62828',
        borderRadius: '20px',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    inputArea: {
        padding: '15px 20px',
        borderTop: '1px solid #eee',
        backgroundColor: '#fff',
    },
    inputForm: {
        display: 'flex',
        gap: '10px',
    },
    input: {
        flex: 1,
        padding: '12px 16px',
        border: '1px solid #ddd',
        borderRadius: '25px',
        fontSize: '14px',
        outline: 'none',
    },
    sendButton: {
        padding: '12px 24px',
        backgroundColor: '#c62828',
        color: '#fff',
        border: 'none',
        borderRadius: '25px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
};

export default AskAI;