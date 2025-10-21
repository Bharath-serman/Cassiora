import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import StackVisualizer from "@/components/dsa/StackVisualizer";
import QueueVisualizer from "@/components/dsa/QueueVisualizer";
import LinkedListVisualizer from "@/components/dsa/LinkedListVisualizer";

// ----- PAGE MAIN -----
export default function DSAVisualizerPage() {
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-card/60 rounded-2xl shadow border animate-fade-in min-h-[70vh]">
      <div className="mb-4 flex items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="sm">
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
           DSA Visualizer
        </h1>
      </div>
      <Tabs defaultValue="stack" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="stack">Stack</TabsTrigger>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="linkedlist">Linked List</TabsTrigger>
        </TabsList>
        <TabsContent value="stack">
          <StackVisualizer />
        </TabsContent>
        <TabsContent value="queue">
          <QueueVisualizer />
        </TabsContent>
        <TabsContent value="linkedlist">
          <LinkedListVisualizer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
