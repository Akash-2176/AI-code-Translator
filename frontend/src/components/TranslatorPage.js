// TranslatorPage.js
import { useState, useEffect, useRef } from 'react';
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

  const chatEndRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      alert("Session expired. Please login again.");
      onLogout();
    }
  }, [onLogout]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleTranslate = async () => {
    if (!code.trim()) {
      setError("Enter some code first!");
      return;
    }

    setLoading(true);
    setError('');

    const userMessage = { role: 'user', message: code };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      const data = await translateCode(code, sourceLang, targetLang);
      const assistantMessage = { 
        role: 'assistant', 
        message: data.translatedCode || "// Translation failed." 
      };

      setChatHistory(prev => [...prev, assistantMessage]);
      setTranslatedCode(data.translatedCode || "// Translation failed.");
      setCode('');
    } catch (err) {
      console.error(err);
      setError("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLang(prev => {
      setTargetLang(prev);
      return targetLang;
    });
  };

  const languageOptions = [
    { label: 'Python', value: 'python' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Java', value: 'java' },
    { label: 'C', value: 'c' },
    { label: 'PHP', value: 'php' },
    { label: 'C#', value: 'csharp' },
  ];

  return (
    <div className="translator-container">

      {/* Top Bar */}
      <div className="top-bar">
        <button onClick={onLogout} className="logout-button">Logout</button>

        <div className="lang-selectors">
          <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>

          <button onClick={handleSwapLanguages} className="swap-button" title="Swap languages">
            🔄
          </button>

          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && <div className="error-message">{error}</div>}

      {/* Chat Section */}
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
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="editor-box">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows="6"
          placeholder="Enter your code here..."
          disabled={loading}
        />
        <button 
          onClick={handleTranslate} 
          className="translate-button" 
          disabled={loading}
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </div>

    </div>
  );
}

export default TranslatorPage;
