import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react';
import { analyzePage } from '../services/seo';

export const SEOTools: React.FC = () => {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzePage(url);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze page');
    } finally {
      setAnalyzing(false);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">SEO Analysis</h1>
        <p className="text-purple-300 mt-1">Analyze and optimize your content for better visibility</p>
      </header>

      <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL to analyze"
              className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!isValidUrl(url) || analyzing}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isValidUrl(url)
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-white/5 text-gray-400 cursor-not-allowed'
            } disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Analyze
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold mb-4">Content Analysis</h2>
              <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span>Title Tag</span>
                    <span className={getScoreColor(analysis.scores.title)}>
                      {analysis.scores.title}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{analysis.title}</p>
                </div>

                <div className="p-4 bg-black/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span>Meta Description</span>
                    <span className={getScoreColor(analysis.scores.description)}>
                      {analysis.scores.description}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{analysis.description}</p>
                </div>

                <div className="p-4 bg-black/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span>Header Structure</span>
                    <span className={getScoreColor(analysis.scores.headers)}>
                      {analysis.scores.headers}/100
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">H1 Tags:</span>
                      <span className="ml-2">{analysis.headers.h1}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">H2 Tags:</span>
                      <span className="ml-2">{analysis.headers.h2}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">H3 Tags:</span>
                      <span className="ml-2">{analysis.headers.h3}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-black/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span>Keyword Analysis</span>
                    <span className={getScoreColor(analysis.scores.keywords)}>
                      {analysis.scores.keywords}/100
                    </span>
                  </div>
                  <div className="space-y-2">
                    {analysis.keywords.map(({ word, density }: { word: string; density: number }) => (
                      <div key={word} className="flex items-center justify-between text-sm">
                        <span>{word}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-white/10 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                density > 5 ? 'bg-red-400' : density > 3 ? 'bg-yellow-400' : 'bg-green-400'
                              }`}
                              style={{ width: `${Math.min(density * 10, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-400">{density.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold mb-4">Technical Performance</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">
                    {analysis.performance.score}
                  </div>
                  <div className="text-sm text-gray-400">Performance Score</div>
                </div>
                <div className="p-4 bg-black/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">
                    {analysis.performance.loadTime}
                  </div>
                  <div className="text-sm text-gray-400">Page Size</div>
                </div>
                <div className="p-4 bg-black/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {analysis.performance.mobileScore}
                  </div>
                  <div className="text-sm text-gray-400">Mobile Score</div>
                </div>
                <div className="p-4 bg-black/20 rounded-lg">
                  <div className="text-2xl font-bold text-amber-400">
                    {analysis.performance.security}
                  </div>
                  <div className="text-sm text-gray-400">Security Rating</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <div className="space-y-4">
              {analysis.recommendations.map((rec: any, index: number) => (
                <div key={index} className="p-4 bg-black/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${getImpactColor(rec.impact)}`}>
                      {rec.impact === 'high' ? (
                        <XCircle className="w-5 h-5" />
                      ) : rec.impact === 'medium' ? (
                        <Info className="w-5 h-5" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{rec.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getImpactColor(rec.impact)} bg-black/20`}>
                          {rec.impact} impact
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{rec.issue}</p>
                      <p className="text-sm mt-2">{rec.suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!analysis && !analyzing && (
        <div className="bg-black/20 backdrop-blur-xl p-12 rounded-xl border border-white/10 text-center">
          <Search className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Enter a URL to Begin Analysis</h2>
          <p className="text-gray-400">
            Get detailed insights and actionable recommendations to improve your SEO
          </p>
        </div>
      )}
    </div>
  );
};