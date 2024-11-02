import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { TitleGenerator } from './TitleGenerator';
import { ScriptGenerator } from './ScriptGenerator';
import { TagRecommendations } from './TagRecommendations';
import { NicheResearch } from './NicheResearch';

export const YouTubeTools: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">YouTube Tools</h1>
        <p className="text-purple-300 mt-1">Create engaging content that ranks</p>
      </header>

      <Tabs defaultValue="titles" className="w-full">
        <TabsList className="bg-black/20 backdrop-blur-xl p-1 rounded-lg mb-6">
          <TabsTrigger value="titles">Title Generator</TabsTrigger>
          <TabsTrigger value="scripts">Script Generator</TabsTrigger>
          <TabsTrigger value="tags">Tag Recommendations</TabsTrigger>
          <TabsTrigger value="niche">Niche Research</TabsTrigger>
        </TabsList>

        <TabsContent value="titles">
          <TitleGenerator />
        </TabsContent>

        <TabsContent value="scripts">
          <ScriptGenerator />
        </TabsContent>

        <TabsContent value="tags">
          <TagRecommendations />
        </TabsContent>

        <TabsContent value="niche">
          <NicheResearch />
        </TabsContent>
      </Tabs>
    </div>
  );
};