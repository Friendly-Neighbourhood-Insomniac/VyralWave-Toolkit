import React from 'react';
import { Eye, Users, ThumbsUp, TrendingUp } from 'lucide-react';
import { MetricCard } from './MetricCard';

interface ChannelMetrics {
  views: string;
  followers: string;
  engagement: string;
  ranking: string;
  viewsChange: string;
  followersChange: string;
  engagementChange: string;
  rankingChange: string;
}

interface MetricsSectionProps {
  metrics: ChannelMetrics;
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Views"
        value={metrics.views}
        change={metrics.viewsChange}
        icon={Eye}
        trend={metrics.viewsChange.startsWith('+') ? 'up' : 'down'}
      />
      <MetricCard
        title="Followers"
        value={metrics.followers}
        change={metrics.followersChange}
        icon={Users}
        trend={metrics.followersChange.startsWith('+') ? 'up' : 'down'}
      />
      <MetricCard
        title="Engagement Rate"
        value={metrics.engagement}
        change={metrics.engagementChange}
        icon={ThumbsUp}
        trend={metrics.engagementChange.startsWith('+') ? 'up' : 'down'}
      />
      <MetricCard
        title="Search Rankings"
        value={metrics.ranking}
        change={metrics.rankingChange}
        icon={TrendingUp}
        trend={metrics.rankingChange.startsWith('+') ? 'up' : 'down'}
      />
    </div>
  );
};