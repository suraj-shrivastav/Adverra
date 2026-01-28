import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import './App.css';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUploadSuccess = (file) => {
    setUploadedFiles(prev => [...prev, file]);
  };

  const handleGenerate = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/assets/generate', {
        designType: 'genZ_prompt',
        prompt: 'A futuristic tech product',
        brandData: {},
        referenceImages: uploadedFiles.map(f => f.uri)
      });
      console.log("Generation Response:", response.data);
      alert("Image generation started! Check console for details.");
    } catch (err) {
      console.error("Generation error:", err);
      alert("Failed to start generation");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-8 text-white">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Gemini Asset Manager
        </h1>
        <p className="text-slate-400 text-lg">
          Upload reference images to Gemini's File API for enhanced context and generation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <ImageUpload onUploadSuccess={handleUploadSuccess} />

        <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-4">Generation Control</h3>
          <p className="text-slate-400 text-sm mb-6">
            Uploaded images will be used as creative context for the AI.
          </p>

          <button
            onClick={handleGenerate}
            disabled={uploadedFiles.length === 0}
            className={`
                    mt-auto w-full py-4 rounded-xl font-bold text-lg transition-all
                    ${uploadedFiles.length === 0
                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/20 active:scale-95'}
                `}
          >
            Generate Asset ✨
          </button>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-12 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </span>
            Uploaded Files in Gemini
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/10 transition-all">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-200">{file.name}</span>
                  <span className="text-xs text-slate-500 font-mono truncate max-w-xs">{file.uri}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded">Ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
