import React, { useState } from 'react';
import { Search, Tag, Copy } from 'lucide-react';

export const TagRecommendations: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const generateTags = () => {
    // Simulate tag generation with common patterns
    const baseTag = topic.toLowerCase().replace(/[^\w\s]/g, '');
    const year = new Date().getFullYear();
    
    const generatedTags = [
      baseTag,
      `${baseTag} tutorial`,
      `${baseTag} guide`,
      `${baseTag} ${year}`,
      `how to ${baseTag}`,
      `${baseTag} tips`,
      `${baseTag} for beginners`,
      `learn ${baseTag}`,
      `${baseTag} explained`,
      `best ${baseTag}`,
      `${baseTag} basics`,
      `${baseTag} course`,
      `${baseTag} tutorial step by step`,
      `${baseTag} masterclass`,
      `${baseTag} tips and tricks`
    ];

    setTags(generatedTags);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyAllTags = () => {
    navigator.clipboard.writeText(tags.join(', '));
  };

  return (
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

        <button
          onClick={generateTags}
          disabled={!topic}
          className="w-full px-6 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Tag className="w-4 h-4" />
          Generate Tags
        </button>

        {tags.length > 0 && (
          <button
            onClick={copyAllTags}
            className="w-full px-6 py-2 bg-black/20 hover:bg-black/30 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy All Tags
          </button>
        )}
      </div>

      <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Recommended Tags</h2>
        <div className="space-y-2">
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-black/20 rounded-lg group"
                >
                  <span className="text-sm">{tag}</span>
                  <button
                    onClick={() => copyToClipboard(tag)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              Generated tags will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};