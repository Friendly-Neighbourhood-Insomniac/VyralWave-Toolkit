import React from 'react';
import { Youtube, AlertCircle } from 'lucide-react';
import { YouTubeOAuth } from './YouTubeOAuth';

interface ChannelImportProps {
  channelUrl: string;
  importType: 'public' | 'private';
  error: string | null;
  importing: boolean;
  onChannelUrlChange: (url: string) => void;
  onImportTypeChange: (type: 'public' | 'private') => void;
  onImport: () => void;
  onOAuthSuccess: (code: string) => void;
  onOAuthError: (error: string) => void;
}

export const ChannelImport: React.FC<ChannelImportProps> = ({
  channelUrl,
  importType,
  error,
  importing,
  onChannelUrlChange,
  onImportTypeChange,
  onImport,
  onOAuthSuccess,
  onOAuthError,
}) => {
  const isValidUrl = (url: string) => {
    if (!url) return false;
    return url.includes('youtube.com/@');
  };

  return (
    <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
      <h2 className="text-xl font-semibold mb-4">Import Your Channel</h2>
      <div className="space-y-4">
        <div className="flex justify-center mb-6">
          <div className="bg-black/20 p-1 rounded-lg flex">
            <button
              onClick={() => {
                onChannelUrlChange('');
                onImportTypeChange('public');
              }}
              className={`px-4 py-2 rounded-md transition-colors ${
                importType === 'public'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Public Data
            </button>
            <button
              onClick={() => {
                onChannelUrlChange('');
                onImportTypeChange('private');
              }}
              className={`px-4 py-2 rounded-md transition-colors ${
                importType === 'private'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Private Data
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={channelUrl}
              onChange={(e) => onChannelUrlChange(e.target.value)}
              placeholder="Enter channel URL (e.g., youtube.com/@channelname)"
              className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          {importType === 'public' ? (
            <button
              onClick={onImport}
              disabled={!isValidUrl(channelUrl) || importing}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isValidUrl(channelUrl)
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 cursor-not-allowed'
              } disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
            >
              {importing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Youtube className="w-4 h-4" />
                  Import Channel
                </>
              )}
            </button>
          ) : (
            <YouTubeOAuth
              onSuccess={onOAuthSuccess}
              onError={onOAuthError}
            />
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {channelUrl && !isValidUrl(channelUrl) && (
          <div className="flex items-center gap-2 text-amber-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            Please enter a valid YouTube channel URL (@username)
          </div>
        )}
      </div>
    </div>
  );
};