import { useState, useEffect } from 'react';
import { translateCode } from '../api';
import './TranslatorPage.css';

function TranslatorPage({ onLogout }) {
  const [code, setCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  const [sourceLang, setSourceLang] = useState('python');
  const [targetLang, setTargetLang] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Check if user is in localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      alert("Session expired. Please login again.");
      onLogout(); // clear user from App state
    }
  }, [onLogout]);

  const handleTranslate = async () => {
    if (!code.trim()) {
      return setError("Enter some code first!");
    }

    setLoading(true);
    setTranslatedCode('');
    setError('');

    // Add the user's code to the chat history
    const newMessage = { role: 'user', message: code };
    setChatHistory(prev => [...prev, newMessage]);

    try {
      const data = await translateCode(code, sourceLang, targetLang);
      const translatedMessage = { role: 'assistant', message: data.translatedCode || "// Translation failed." };

      // Add assistant's response to the chat history
      setChatHistory(prev => [...prev, translatedMessage]);
      setTranslatedCode(data.translatedCode || "// Translation failed.");
    } catch (err) {
      console.error(err);
      setError("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getMode = (lang) => {
    switch (lang) {
      case 'python': return 'python';
      case 'javascript': return 'javascript';
      case 'java': return 'text/x-java';
      case 'c': return 'text/x-csrc';
      case 'php': return 'application/x-httpd-php';
      case 'csharp': return 'text/x-csharp';
      default: return 'text';
    }
  };

  return (
    <div className="translator-container">
      <button onClick={onLogout} className="logout-button">Logout</button>

      <div className="chat-container">
        <div className="chat-box">
          <h2>Chat</h2>
          <div className="chat-history">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.role}`}>
                <span>{msg.role === 'user' ? 'You' : 'Assistant'}:</span>
                <pre>{msg.message}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="lang-selectors">
        <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="php">PHP</option>
          <option value="csharp">C#</option>
        </select>

        <button
          onClick={() => {
            const temp = sourceLang;
            setSourceLang(targetLang);
            setTargetLang(temp);
          }}
          className="swap-button"
        >
          🔄
        </button>

        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="php">PHP</option>
          <option value="csharp">C#</option>
        </select>
      </div>

      <div className="editor-box">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows="5"
          placeholder="Enter your code here..."
        />
        <button onClick={handleTranslate} className="translate-button" disabled={loading}>
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </div>
    </div>
  );
}

export default TranslatorPage;
