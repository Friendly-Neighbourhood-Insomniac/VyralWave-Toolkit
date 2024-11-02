import React from 'react';
import { Lock } from 'lucide-react';

interface YouTubeOAuthProps {
  onSuccess: (code: string) => void;
  onError: (error: string) => void;
}

export const YouTubeOAuth: React.FC<YouTubeOAuthProps> = ({ onSuccess, onError }) => {
  const initiateOAuth = () => {
    try {
      const clientId = import.meta.env.VITE_YOUTUBE_OAUTH_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_YOUTUBE_OAUTH_REDIRECT_URI;

      if (!clientId || !redirectUri) {
        throw new Error('OAuth credentials not configured');
      }

      const oauthUrl = new URL('https://accounts.google.com/o/oauth2/auth');
      oauthUrl.searchParams.append('client_id', clientId);
      oauthUrl.searchParams.append('redirect_uri', redirectUri);
      oauthUrl.searchParams.append('response_type', 'code');
      oauthUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/youtube.readonly');
      oauthUrl.searchParams.append('access_type', 'offline');
      oauthUrl.searchParams.append('prompt', 'consent');
      
      // Open OAuth window
      const width = 600;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const oauthWindow = window.open(
        oauthUrl.toString(),
        'YouTube Authorization',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for the OAuth redirect
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'YOUTUBE_OAUTH_SUCCESS') {
          onSuccess(event.data.code);
          window.removeEventListener('message', handleMessage);
          oauthWindow?.close();
        } else if (event.data.type === 'YOUTUBE_OAUTH_ERROR') {
          onError(event.data.error);
          window.removeEventListener('message', handleMessage);
          oauthWindow?.close();
        }
      };

      window.addEventListener('message', handleMessage);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to initiate OAuth flow');
    }
  };

  return (
    <button
      onClick={initiateOAuth}
      className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
    >
      <Lock className="w-4 h-4" />
      Authorize YouTube Access
    </button>
  );
};