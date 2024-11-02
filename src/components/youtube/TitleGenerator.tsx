import React, { useState } from 'react';
import { Sparkles, Copy } from 'lucide-react';

export const TitleGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('how-to');
  const [titles, setTitles] = useState<string[]>([]);

  const generateTitles = () => {
    const templates = {
      'how-to': [
        `How to ${topic} (Complete Guide ${new Date().getFullYear()})`,
        `${topic} Tutorial for Beginners`,
        `Step by Step: ${topic} Made Easy`,
        `Master ${topic} in Under 10 Minutes`,
        `The Ultimate Guide to ${topic}`,
      ],
      'listicle': [
        `Top 10 ${topic} Tips You Need to Know`,
        `5 ${topic} Secrets Experts Won't Tell You`,
        `7 Mind-Blowing ${topic} Hacks`,
        `3 Common ${topic} Mistakes (And How to Fix Them)`,
        `${topic}: 8 Things You're Doing Wrong`,
      ],
      'review': [
        `${topic} Review: The Truth Revealed`,
        `Is ${topic} Worth It? Honest Review`,
        `${topic} vs Competition: Ultimate Comparison`,
        `${topic} in ${new Date().getFullYear()}: Still Worth It?`,
        `The TRUTH About ${topic} (Not Sponsored)`,
      ],
    }[style] || [];

    setTitles(templates);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Video Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your video topic"
              className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Title Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 transition-colors"
            >
              <option value="how-to">How-to Guide</option>
              <option value="listicle">List Format</option>
              <option value="review">Review Style</option>
            </select>
          </div>

          <button
            onClick={generateTitles}
            disabled={!topic}
            className="w-full px-6 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Generate Titles
          </button>
        </div>

        <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Generated Titles</h2>
          <div className="space-y-3">
            {titles.length > 0 ? (
              titles.map((title, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-black/20 rounded-lg group"
                >
                  <span className="text-sm">{title}</span>
                  <button
                    onClick={() => copyToClipboard(title)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                Generated titles will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};