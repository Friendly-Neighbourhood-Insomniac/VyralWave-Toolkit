import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export const ScriptGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('educational');
  const [duration, setDuration] = useState('5');
  const [script, setScript] = useState('');

  const generateScript = () => {
    const templates = {
      educational: `[Intro - 30 seconds]
• Hook: "Have you ever wondered about ${topic}?"
• Quick overview of what viewers will learn
• Channel branding

[Main Content - ${Number(duration) - 1} minutes]
• Point 1: Introduction to ${topic}
• Point 2: Key concepts explained
• Point 3: Step-by-step breakdown
• Point 4: Common misconceptions
• Point 5: Pro tips and tricks

[Conclusion - 30 seconds]
• Recap key points
• Call to action
• Subscribe reminder`,
      
      entertainment: `[Hook - 20 seconds]
• Attention-grabbing opener about ${topic}
• Teaser of the best moment

[Content - ${Number(duration) - 0.5} minutes]
• Story setup
• Building suspense
• Main event/revelation
• Reaction and commentary
• Behind the scenes

[Outro - 30 seconds]
• Wrap-up thoughts
• Social media callouts
• Subscribe reminder`,
      
      review: `[Introduction - 30 seconds]
• Quick ${topic} overview
• Why this review matters
• Disclosure statement

[Review - ${Number(duration) - 1} minutes]
• First impressions
• Key features
• Pros and cons
• Performance tests
• Price analysis
• Comparisons

[Verdict - 30 seconds]
• Final rating
• Recommendations
• Like and subscribe reminder`
    }[style] || '';

    setScript(templates);
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

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Content Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 transition-colors"
          >
            <option value="educational">Educational</option>
            <option value="entertainment">Entertainment</option>
            <option value="review">Review</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Video Duration (minutes)
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 transition-colors"
          >
            {[5, 10, 15, 20].map(value => (
              <option key={value} value={value}>{value} minutes</option>
            ))}
          </select>
        </div>

        <button
          onClick={generateScript}
          disabled={!topic}
          className="w-full px-6 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Generate Script
        </button>
      </div>

      <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Script Outline</h2>
        <div className="prose prose-invert max-w-none">
          {script ? (
            <pre className="whitespace-pre-wrap text-sm font-mono bg-black/20 p-4 rounded-lg">
              {script}
            </pre>
          ) : (
            <div className="text-center text-gray-400 py-8">
              Generated script will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};