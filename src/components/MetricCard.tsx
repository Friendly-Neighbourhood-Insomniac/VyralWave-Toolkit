import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'down';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
}) => {
  return (
    <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Icon className="w-5 h-5 text-purple-400" />
        </div>
      </div>
      <div className="mt-2">
        <span
          className={`text-sm ${
            trend === 'up' ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
};