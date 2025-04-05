import { useState } from 'react';
import logo from './logo.png';
import './App.css';
import CodeMirror from '@uiw/react-codemirror';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { githubLight } from '@uiw/codemirror-theme-github';

function App() {
  const [code, setCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  const [sourceLang, setSourceLang] = useState('python');
  const [targetLang, setTargetLang] = useState('javascript');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!code.trim()) {
      alert("Please enter some code to translate.");
      return;
    }

    setLoading(true);
    setTranslatedCode("");

    try {
      const response = await fetch("http://localhost:5000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, sourceLang, targetLang }),
      });
      const data = await response.json();
      setTranslatedCode(data.translatedCode || "Translation failed.");
    } catch (error) {
      console.error("Error:", error);
      setTranslatedCode("Error: Unable to translate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Enter Code:</h2>
          <CodeMirror
            value={code}
            height="200px"
            theme={githubLight}
            extensions={[loadLanguage(sourceLang)]}
            onChange={(value) => setCode(value)}
            className="border rounded-md"
          />

          <div className="flex justify-between mt-4">
            <select
              className="p-2 border rounded-md"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="c">C</option>
            </select>
            <span className="px-2">→</span>
            <select
              className="p-2 border rounded-md"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="c">C</option>
            </select>
          </div>

          <button
            className="w-full mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleTranslate}
            disabled={loading}
          >
            {loading ? "Translating..." : "Translate Code"}
          </button>

          <h2 className="text-lg font-semibold mt-6">Translated Code:</h2>
          <CodeMirror
            value={translatedCode}
            height="200px"
            theme={githubLight}
            extensions={[loadLanguage(targetLang)]}
            readOnly
            className="border rounded-md bg-gray-200"
          />
        </div>
      </header>
    </div>
  );
}

export default App;
