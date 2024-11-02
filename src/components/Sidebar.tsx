import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Waves, 
  Youtube,
  Search, 
  BarChart2, 
  Calendar, 
  Hash, 
  Settings 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-black/20 backdrop-blur-xl h-screen sticky top-0 p-4 border-r border-white/10">
      <div className="flex items-center gap-2 mb-8">
        <Waves className="w-8 h-8 text-purple-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          VyralWave
        </h1>
      </div>

      <nav className="space-y-1">
        {[
          { icon: BarChart2, label: 'Dashboard', to: '/' },
          { icon: Search, label: 'SEO Tools', to: '/seo' },
          { icon: Youtube, label: 'YouTube', to: '/youtube' },
          { icon: Calendar, label: 'Content Calendar', to: '/calendar' },
          { icon: Hash, label: 'Hashtag Analytics', to: '/hashtags' },
          { icon: Settings, label: 'Settings', to: '/settings' },
        ].map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};