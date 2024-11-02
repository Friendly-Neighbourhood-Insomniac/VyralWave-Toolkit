interface ChannelInsight {
  name: string;
  subscribers: string;
  views: string;
  growth: string;
  topVideo: string;
}

interface VideoInsight {
  title: string;
  views: string;
  engagement: string;
  growth: string;
  publishDate: string;
}

export interface YouTubeChannelStats {
  id: string;
  title: string;
  views: string;
  subscribers: string;
  videos: string;
  engagement: string;
  viewsChange: string;
  subscribersChange: string;
  videosChange: string;
  engagementChange: string;
}

export interface NicheAnalysis {
  popularChannels: ChannelInsight[];
  growingChannels: ChannelInsight[];
  popularVideos: VideoInsight[];
  trendingVideos: VideoInsight[];
  trends: string[];
  taglines: string[];
}

export const getChannelStats = async (channelUrl: string, authCode?: string): Promise<YouTubeChannelStats> => {
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  const CLIENT_ID = import.meta.env.VITE_YOUTUBE_OAUTH_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.VITE_YOUTUBE_OAUTH_CLIENT_SECRET;
  const REDIRECT_URI = import.meta.env.VITE_YOUTUBE_OAUTH_REDIRECT_URI;
  
  if (!API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  try {
    let accessToken: string | undefined;

    if (authCode) {
      // Exchange authorization code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: authCode,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange authorization code for tokens');
      }

      const tokens = await tokenResponse.json();
      accessToken = tokens.access_token;
    }

    // Extract channel handle from URL
    const handle = extractChannelHandle(channelUrl);
    
    // First, search for the channel by handle
    const searchResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=@${handle}&type=channel&key=${API_KEY}`,
      accessToken ? {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      } : undefined
    );
    
    if (!searchResponse.ok) {
      throw new Error(`Failed to fetch channel data: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    const channelId = searchData.items?.[0]?.id?.channelId;
    
    if (!channelId) {
      throw new Error('Channel not found');
    }

    // Then get detailed channel statistics
    const channelResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`,
      accessToken ? {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      } : undefined
    );
    
    if (!channelResponse.ok) {
      throw new Error(`Failed to fetch channel statistics: ${channelResponse.statusText}`);
    }

    const channelData = await channelResponse.json();
    const channel = channelData.items?.[0];
    
    if (!channel) {
      throw new Error('Channel statistics not available');
    }

    const stats = channel.statistics;
    const previousStats = await getPreviousStats(channelId);

    // Get recent videos for engagement calculation
    const videosResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&order=date&type=video&maxResults=10&key=${API_KEY}`,
      accessToken ? {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      } : undefined
    );
    
    if (!videosResponse.ok) {
      throw new Error(`Failed to fetch videos: ${videosResponse.statusText}`);
    }

    const videosData = await videosResponse.json();
    const engagement = await calculateEngagementRate(videosData.items || [], API_KEY, accessToken);

    return {
      id: channel.id,
      title: channel.snippet?.title || '',
      views: formatNumber(stats?.viewCount || '0'),
      subscribers: formatNumber(stats?.subscriberCount || '0'),
      videos: formatNumber(stats?.videoCount || '0'),
      engagement: `${engagement}%`,
      viewsChange: calculateChange(stats?.viewCount, previousStats.viewCount),
      subscribersChange: calculateChange(stats?.subscriberCount, previousStats.subscriberCount),
      videosChange: calculateChange(stats?.videoCount, previousStats.videoCount),
      engagementChange: calculateChange(engagement.toString(), previousStats.engagement)
    };
  } catch (error) {
    console.error('Error fetching YouTube stats:', error);
    throw error;
  }
};

export const analyzeNiche = async (niche: string): Promise<NicheAnalysis> => {
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  
  if (!API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  try {
    // Get top channels in the niche
    const channelsResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(niche)}&type=channel&order=viewCount&maxResults=3&key=${API_KEY}`
    );

    if (!channelsResponse.ok) {
      throw new Error('Failed to fetch channel data');
    }

    const channelsData = await channelsResponse.json();
    const channelIds = channelsData.items.map((item: any) => item.id.channelId);

    // Get detailed channel statistics
    const channelStatsResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds.join(',')}&key=${API_KEY}`
    );

    if (!channelStatsResponse.ok) {
      throw new Error('Failed to fetch channel statistics');
    }

    const channelStatsData = await channelStatsResponse.json();

    // Get trending videos in the niche
    const videosResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(niche)}&type=video&order=viewCount&maxResults=3&key=${API_KEY}`
    );

    if (!videosResponse.ok) {
      throw new Error('Failed to fetch video data');
    }

    const videosData = await videosResponse.json();
    const videoIds = videosData.items.map((item: any) => item.id.videoId);

    // Get detailed video statistics
    const videoStatsResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${API_KEY}`
    );

    if (!videoStatsResponse.ok) {
      throw new Error('Failed to fetch video statistics');
    }

    const videoStatsData = await videoStatsResponse.json();

    // Process channel data
    const popularChannels = channelStatsData.items.map((channel: any) => ({
      name: channel.snippet.title,
      subscribers: formatNumber(channel.statistics.subscriberCount),
      views: formatNumber(channel.statistics.viewCount),
      growth: calculateGrowth(channel.statistics.subscriberCount),
      topVideo: channel.snippet.title
    }));

    // Process video data
    const popularVideos = videoStatsData.items.map((video: any) => ({
      title: video.snippet.title,
      views: formatNumber(video.statistics.viewCount),
      engagement: calculateVideoEngagement(video.statistics),
      growth: calculateVideoGrowth(video.statistics.viewCount),
      publishDate: formatDate(video.snippet.publishedAt)
    }));

    // Analyze trends based on video titles and descriptions
    const trends = analyzeTrends(videoStatsData.items);

    // Generate taglines based on successful video patterns
    const taglines = generateTaglines(niche, videoStatsData.items);

    return {
      popularChannels,
      growingChannels: [], // This would require historical data
      popularVideos,
      trendingVideos: [], // This would require trending API endpoint
      trends,
      taglines
    };
  } catch (error) {
    console.error('Error analyzing niche:', error);
    throw error;
  }
};

const extractChannelHandle = (url: string): string => {
  const regex = /youtube\.com\/@([^/?]+)/;
  const match = url.match(regex);
  if (!match) throw new Error('Invalid YouTube channel URL. Please use a URL with @username format.');
  return match[1];
};

const formatNumber = (num: string): string => {
  const n = parseInt(num, 10);
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return num;
};

const calculateGrowth = (subscribers: string): string => {
  // In a real implementation, this would compare against historical data
  const growth = Math.random() * 20 + 5; // Placeholder
  return `+${growth.toFixed(1)}%`;
};

const calculateVideoEngagement = (stats: any): string => {
  const views = parseInt(stats.viewCount, 10);
  const likes = parseInt(stats.likeCount, 10);
  const comments = parseInt(stats.commentCount, 10);
  
  if (!views) return '0%';
  return `${((likes + comments) / views * 100).toFixed(1)}%`;
};

const calculateVideoGrowth = (views: string): string => {
  // In a real implementation, this would compare against historical data
  const growth = Math.random() * 30 + 10; // Placeholder
  return `+${growth.toFixed(1)}%`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

const calculateChange = (current: string = '0', previous: string = '0'): string => {
  const curr = parseInt(current, 10);
  const prev = parseInt(previous, 10);
  if (!prev) return '+0%';
  
  const change = ((curr - prev) / prev * 100).toFixed(1);
  return `${change > 0 ? '+' : ''}${change}%`;
};

const getPreviousStats = async (channelId: string) => {
  // This would normally fetch historical data from your database
  return {
    viewCount: '0',
    subscriberCount: '0',
    videoCount: '0',
    engagement: '0'
  };
};

const calculateEngagementRate = async (videos: any[], apiKey: string, accessToken?: string): Promise<number> => {
  try {
    const videoIds = videos.map(video => video.id.videoId).join(',');
    const statsResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`,
      accessToken ? {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      } : undefined
    );
    
    if (!statsResponse.ok) {
      throw new Error('Failed to fetch video statistics');
    }

    const statsData = await statsResponse.json();
    const videoStats = statsData.items || [];

    const engagementRates = videoStats.map(video => {
      const stats = video.statistics;
      const views = parseInt(stats?.viewCount || '0', 10);
      const likes = parseInt(stats?.likeCount || '0', 10);
      const comments = parseInt(stats?.commentCount || '0', 10);
      
      if (!views) return 0;
      return ((likes + comments) / views) * 100;
    });

    const averageEngagement = engagementRates.reduce((a, b) => a + b, 0) / engagementRates.length;
    return Number(averageEngagement.toFixed(1)) || 0;
  } catch (error) {
    console.error('Error calculating engagement rate:', error);
    return 0;
  }
};

const analyzeTrends = (videos: any[]): string[] => {
  const trends = new Set<string>();
  
  videos.forEach(video => {
    const title = video.snippet.title.toLowerCase();
    const description = video.snippet.description.toLowerCase();
    
    if (title.includes('how to') || description.includes('tutorial')) {
      trends.add('Tutorial and how-to content is trending');
    }
    if (title.includes('review') || description.includes('review')) {
      trends.add('Product reviews show high engagement');
    }
    if (title.includes('top') || title.includes('best')) {
      trends.add('List-based content performs well');
    }
    if (title.includes('challenge') || description.includes('challenge')) {
      trends.add('Challenge videos are gaining traction');
    }
  });
  
  return Array.from(trends);
};

const generateTaglines = (niche: string, videos: any[]): string[] => {
  const commonPatterns = videos.reduce((patterns: string[], video: any) => {
    const title = video.snippet.title.toLowerCase();
    if (title.includes('how to')) patterns.push('how-to');
    if (title.includes('guide')) patterns.push('guide');
    if (title.includes('tips')) patterns.push('tips');
    if (title.includes('secrets')) patterns.push('secrets');
    if (title.includes('tutorial')) patterns.push('tutorial');
    return patterns;
  }, []);

  const uniquePatterns = Array.from(new Set(commonPatterns));
  
  return uniquePatterns.map(pattern => {
    switch (pattern) {
      case 'how-to':
        return `Master ${niche} with Step-by-Step Guidance`;
      case 'guide':
        return `Complete ${niche} Guide for Success`;
      case 'tips':
        return `Essential ${niche} Tips & Strategies`;
      case 'secrets':
        return `Hidden ${niche} Secrets Revealed`;
      case 'tutorial':
        return `${niche} Mastery Tutorial Series`;
      default:
        return `Transform Your ${niche} Journey`;
    }
  });
};