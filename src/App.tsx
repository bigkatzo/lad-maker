import React, { useState } from 'react';
import { ImageDropzone } from './components/ImageDropzone';
import { ProcessingSpinner } from './components/ProcessingSpinner';
import { ImageResult } from './components/ImageResult';
import { generateLadMakerImage } from './services/openai';
import { Package, Pill } from 'lucide-react';

type AppState = 'upload' | 'processing' | 'result' | 'error';

function App() {
  const [state, setState] = useState<AppState>('upload');
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleImageSelect = async (file: File) => {
    setState('processing');
    
    // Create URL for original image
    const originalUrl = URL.createObjectURL(file);
    setOriginalImageUrl(originalUrl);

    try {
      const result = await generateLadMakerImage(file);
      
      if (result.success && result.imageUrl) {
        setGeneratedImageUrl(result.imageUrl);
        setState('result');
      } else {
        setError(result.error || 'Failed to generate image');
        setState('error');
      }
    } catch {
      setError('An unexpected error occurred');
      setState('error');
    }
  };

  const handleReset = () => {
    setState('upload');
    setOriginalImageUrl('');
    setGeneratedImageUrl('');
    setError('');
  };

  const handleCopyCA = async () => {
    try {
      await navigator.clipboard.writeText('H57gd4TRhsmhg5brTe2bygibAKp2btwS1uEStoUrpump');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const renderContent = () => {
    switch (state) {
      case 'upload':
        return <ImageDropzone onImageSelect={handleImageSelect} />;
      case 'processing':
        return <ProcessingSpinner />;
      case 'result':
        return (
          <ImageResult
            originalImage={originalImageUrl}
            generatedImage={generatedImageUrl}
            onReset={handleReset}
          />
        );
      case 'error':
        return (
          <div className="text-center p-8">
            <div className="bg-red-100 border-4 border-red-500 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-southpark font-bold text-red-800 mb-4">
                Lad Error! Something Went Wrong!
              </h3>
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full border-4 border-gray-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900">
      {/* Header */}
      <header className="bg-black border-b-8 border-gray-600 shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/lad.png" 
                alt="Lad Logo" 
                className="w-16 h-16 mr-4"
              />
              <h1 className="text-5xl font-southpark font-bold text-white drop-shadow-lg">
                LAD MAKER
              </h1>
              <img 
                src="/lad.png" 
                alt="Lad Logo" 
                className="w-16 h-16 ml-4"
              />
            </div>
            <p className="text-xl text-gray-300 font-southpark font-semibold">
              Transform Your Photos into Lad Style! 💪🏋️‍♂️
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="bg-gray-100 rounded-3xl border-8 border-black shadow-2xl p-8 md:p-12">
          {renderContent()}
        </div>
      </main>

      {/* CA Address Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="p-8 md:p-12 text-center">
          <h2 className="text-3xl font-southpark font-bold text-white mb-6 drop-shadow-lg">
            Contract Address 🏋️‍♂️
          </h2>
          
          <div className="mt-8">
            <button
              onClick={handleCopyCA}
              className="bg-black hover:bg-gray-800 text-white font-mono text-sm md:text-base py-4 px-6 rounded-full border-4 border-gray-600 transform hover:scale-105 transition-all duration-200 shadow-lg break-all"
            >
              {copySuccess ? '✅ Copied!' : 'H57gd4TRhsmhg5brTe2bygibAKp2btwS1uEStoUrpump'}
            </button>
            {!copySuccess && (
              <p className="text-white text-sm mt-2 font-southpark drop-shadow-md">
                👆 Click to copy CA address
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Sub-Footer Links */}
      <section className="bg-gray-700 py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-southpark font-bold text-white mb-6">
            links
          </h3>
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
            {/* X (Twitter) */}
            <a
              href="https://x.com/i/communities/1962062999809843209"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black hover:bg-gray-900 text-white p-4 rounded-full border-4 border-gray-800 transform hover:scale-110 transition-all duration-200 shadow-lg"
              title="Join our X Community"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  fill="currentColor"
                />
              </svg>
            </a>

            {/* Telegram */}
            <a
              href="https://t.me/ladcoinctogroup"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full border-4 border-gray-800 transform hover:scale-110 transition-all duration-200 shadow-lg"
              title="Join our Telegram"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.94-1.29 4.91-2.14 5.91-2.55 2.81-1.18 3.39-1.39 3.77-1.39.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"
                  fill="currentColor"
                />
              </svg>
            </a>

            {/* Pump.fun */}
            <a
              href="https://pump.fun/coin/H57gd4TRhsmhg5brTe2bygibAKp2btwS1uEStoUrpump"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full border-4 border-gray-800 transform hover:scale-110 transition-all duration-200 shadow-lg"
              title="View on Pump.fun"
            >
              <Pill size={32} />
            </a>

            {/* Store */}
            <a
              href="https://store.fun/lad"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full border-4 border-gray-800 transform hover:scale-110 transition-all duration-200 shadow-lg"
              title="Visit our Store"
            >
              <Package size={32} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-0">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Not affiliated with Virgin vs Lad meme creators. Just for fun! 
            <br />
            Congratulations, you're now a Lad!
          </p>
        </div>
      </footer>

      {/* API Key Notice */}
      {(!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY.includes('your_ope')) && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-yellow-900 p-4 rounded-lg shadow-lg max-w-sm">
          <p className="text-sm font-semibold">
            ⚠️ API Key Issue: Check your Netlify environment variables
            <br />
            <small>Current: {import.meta.env.VITE_OPENAI_API_KEY?.substring(0, 10) || 'undefined'}...</small>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;