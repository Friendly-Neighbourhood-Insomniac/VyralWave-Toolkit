import React, { useState } from 'react';
import { Search, TrendingUp, Users, PlayCircle, Trophy, Rocket, Sparkles, AlertCircle, Lightbulb } from 'lucide-react';
import { analyzeNiche, NicheAnalysis } from '../../services/youtube';

const POPULAR_NICHES = [
  { value: 'gaming', label: 'Gaming & Lets Plays' },
  { value: 'tech', label: 'Tech Reviews & Tutorials' },
  { value: 'lifestyle', label: 'Lifestyle & Vlogs' },
  { value: 'education', label: 'Educational Content' },
  { value: 'cooking', label: 'Cooking & Recipe Videos' },
  { value: 'fitness', label: 'Fitness & Workout' },
  { value: 'finance', label: 'Personal Finance' },
  { value: 'beauty', label: 'Beauty & Makeup' },
  { value: 'diy', label: 'DIY & Crafts' },
  { value: 'music', label: 'Music & Covers' },
  { value: 'comedy', label: 'Comedy & Entertainment' },
  { value: 'travel', label: 'Travel & Adventure' },
  { value: 'automotive', label: 'Automotive & Cars' },
  { value: 'pets', label: 'Pets & Animals' },
  { value: 'science', label: 'Science & Education' }
];

const generateContentRecommendations = (analysis: NicheAnalysis) => {
  const recommendations = [];

  // Analyze video patterns
  const hasHowTo = analysis.popularVideos.some(v => 
    v.title.toLowerCase().includes('how to') || 
    v.title.toLowerCase().includes('tutorial')
  );
  
  const hasList = analysis.popularVideos.some(v => 
    v.title.match(/\d+/g) || 
    v.title.toLowerCase().includes('top') || 
    v.title.toLowerCase().includes('best')
  );
  
  const hasReview = analysis.popularVideos.some(v => 
    v.title.toLowerCase().includes('review') || 
    v.title.toLowerCase().includes('vs')
  );

  // Generate specific recommendations
  if (hasHowTo) {
    recommendations.push({
      type: 'Tutorial Content',
      description: 'Create step-by-step tutorials and how-to guides',
      metrics: 'High engagement rate on educational content'
    });
  }

  if (hasList) {
    recommendations.push({
      type: 'List-Based Content',
      description: 'Compile top lists and rankings',
      metrics: 'Strong viewer retention on curated content'
    });
  }

  if (hasReview) {
    recommendations.push({
      type: 'Review Content',
      description: 'Produce in-depth reviews and comparisons',
      metrics: 'High search visibility for product research'
    });
  }

  // Add general recommendations based on trends
  if (analysis.trends.length > 0) {
    recommendations.push({
      type: 'Trend-Based Content',
      description: 'Create content around current trends',
      metrics: 'Increased potential for viral growth'
    });
  }

  return recommendations;
};

export const NicheResearch: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [analysis, setAnalysis] = useState<NicheAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeNiche(niche);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze niche');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const contentRecommendations = analysis ? generateContentRecommendations(analysis) : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Select YouTube Niche
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 transition-colors"
            >
              <option value="">Select a niche...</option>
              {POPULAR_NICHES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!niche || loading}
            className="w-full px-6 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Analyze Niche
              </>
            )}
          </button>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm p-3 bg-red-400/10 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {analysis?.trends && analysis.trends.length > 0 && (
          <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Current Trends</h2>
            <div className="space-y-3">
              {analysis.trends.map((trend, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-black/20 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-purple-400 mt-1" />
                  <span className="text-sm">{trend}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {analysis && contentRecommendations.length > 0 && (
        <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold">Content Recommendations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contentRecommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-black/20 rounded-lg">
                <h3 className="font-medium text-purple-400 mb-2">{rec.type}</h3>
                <p className="text-sm text-gray-200 mb-2">{rec.description}</p>
                <p className="text-xs text-gray-400">{rec.metrics}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {analysis.popularChannels.length > 0 && (
              <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-xl font-semibold">Top Performing Channels</h2>
                </div>
                <div className="space-y-4">
                  {analysis.popularChannels.map((channel, index) => (
                    <div key={index} className="p-4 bg-black/20 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{channel.name}</h3>
                          <p className="text-sm text-gray-400">Top: {channel.topVideo}</p>
                        </div>
                        <span className="text-green-400 text-sm">{channel.growth}</span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>{channel.subscribers} subs</span>
                        <span>{channel.views} views</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.popularVideos.length > 0 && (
              <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <PlayCircle className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold">Most Popular Videos</h2>
                </div>
                <div className="space-y-4">
                  {analysis.popularVideos.map((video, index) => (
                    <div key={index} className="p-4 bg-black/20 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{video.title}</h3>
                        <span className="text-green-400 text-sm">{video.growth}</span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>{video.views} views</span>
                        <span>{video.engagement} engagement</span>
                        <span>{video.publishDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {analysis.growingChannels.length > 0 && (
              <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="w-5 h-5 text-green-400" />
                  <h2 className="text-xl font-semibold">Fastest Growing Channels</h2>
                </div>
                <div className="space-y-4">
                  {analysis.growingChannels.map((channel, index) => (
                    <div key={index} className="p-4 bg-black/20 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{channel.name}</h3>
                          <p className="text-sm text-gray-400">Top: {channel.topVideo}</p>
                        </div>
                        <span className="text-green-400 text-sm">{channel.growth}</span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>{channel.subscribers} subs</span>
                        <span>{channel.views} views</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.taglines.length > 0 && (
              <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-semibold">Recommended Taglines</h2>
                </div>
                <div className="space-y-3">
                  {analysis.taglines.map((tagline, index) => (
                    <div key={index} className="p-3 bg-black/20 rounded-lg">
                      <p className="text-sm">{tagline}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!analysis && !loading && !error && (
        <div className="bg-black/20 backdrop-blur-xl p-12 rounded-xl border border-white/10 text-center">
          <Search className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Select a Niche to Analyze</h2>
          <p className="text-gray-400">
            Get detailed insights about top performers and trends in your chosen niche
          </p>
        </div>
      )}
    </div>
  );
};