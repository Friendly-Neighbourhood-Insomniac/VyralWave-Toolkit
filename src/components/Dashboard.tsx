import React, { useState } from 'react';
import { Youtube, Waves } from 'lucide-react';
import { Chart } from './Chart';
import { MetricsSection } from './MetricsSection';
import { getChannelStats, YouTubeChannelStats } from '../services/youtube';
import { ChannelImport } from './youtube/ChannelImport';

export const Dashboard: React.FC = () => {
  const [channelUrl, setChannelUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channelData, setChannelData] = useState<YouTubeChannelStats | null>(null);
  const [importType, setImportType] = useState<'public' | 'private'>('public');

  const handleImport = async () => {
    setImporting(true);
    setError(null);

    try {
      if (importType === 'private') {
        setError('Please authorize access to your YouTube account');
        return;
      }

      const stats = await getChannelStats(channelUrl);
      setChannelData(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import channel data');
    } finally {
      setImporting(false);
    }
  };

  const handleOAuthSuccess = async (code: string) => {
    setImporting(true);
    setError(null);

    try {
      const stats = await getChannelStats(channelUrl, code);
      setChannelData(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete OAuth flow');
    } finally {
      setImporting(false);
    }
  };

  const handleOAuthError = (error: string) => {
    setError(`Authorization failed: ${error}`);
  };

  const metrics = channelData ? {
    views: channelData.views,
    followers: channelData.subscribers,
    engagement: channelData.engagement,
    ranking: channelData.id ? `#${Math.floor(Math.random() * 100)}` : 'N/A',
    viewsChange: channelData.viewsChange,
    followersChange: channelData.subscribersChange,
    engagementChange: channelData.engagementChange,
    rankingChange: '+0'
  } : null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col items-center text-center mb-8">
        <div className="w-32 h-32 mb-4 flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full">
          <Waves className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
          Welcome to VyralWave-Toolkit
        </h1>
        <p className="text-purple-300 mt-2">Your all-in-one YouTube analytics platform</p>
      </header>

      <ChannelImport
        channelUrl={channelUrl}
        importType={importType}
        error={error}
        importing={importing}
        onChannelUrlChange={setChannelUrl}
        onImportTypeChange={setImportType}
        onImport={handleImport}
        onOAuthSuccess={handleOAuthSuccess}
        onOAuthError={handleOAuthError}
      />

      {metrics && <MetricsSection metrics={metrics} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {channelData && (
          <>
            <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Performance Overview</h2>
                <div className="text-sm text-purple-300">{channelData.title}</div>
              </div>
              <Chart />
            </div>
            
            <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold mb-4">Channel Statistics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <span>Total Videos</span>
                  <span className="font-semibold">{channelData.videos}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <span>Average Views</span>
                  <span className="font-semibold">
                    {formatNumber(parseInt(channelData.views.replace(/[KM]/g, '')) / parseInt(channelData.videos))}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <span>Subscriber Growth</span>
                  <span className={`font-semibold ${
                    channelData.subscribersChange.startsWith('+') 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {channelData.subscribersChange}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
        
        {!channelData && (
          <div className="lg:col-span-2 bg-black/20 backdrop-blur-xl p-12 rounded-xl border border-white/10 text-center">
            <Youtube className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Channel Data</h2>
            <p className="text-gray-400">
              Import your YouTube channel to view analytics and performance metrics
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const formatNumber = (num: number): string => {
  if (isNaN(num)) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toFixed(0);
};