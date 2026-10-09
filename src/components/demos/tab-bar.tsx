"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabBar() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">概要</TabsTrigger>
        <TabsTrigger value="metrics">メトリクス</TabsTrigger>
        <TabsTrigger value="logs">ログ</TabsTrigger>
        <TabsTrigger value="settings">設定</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-muted-foreground p-3">プロジェクトの概要が表示されます。</TabsContent>
      <TabsContent value="metrics" className="text-sm text-muted-foreground p-3">直近 30 日のメトリクス。</TabsContent>
      <TabsContent value="logs" className="text-sm text-muted-foreground p-3">サーバーログ stream。</TabsContent>
      <TabsContent value="settings" className="text-sm text-muted-foreground p-3">プロジェクト設定。</TabsContent>
    </Tabs>
  );
}
