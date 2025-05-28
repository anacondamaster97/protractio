'use client';

import { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import { 
  Database, 
  PieChart, 
  FileBarChart, 
  TrendingUp 
} from 'lucide-react';
import '@/App.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const agents = [
  {
    title: 'Data Engineering Agent',
    description: 'Transform and analyze your data with enterprise-grade security. Perfect for teams who need automated data pipelines without compromising privacy.',
    icon: Database,
    features: ['Automated ETL Processes', 'Data Quality Checks', 'Schema Management', 'Secure Data Processing']
  },
  {
    title: 'Marketing Agent',
    description: 'Leverage your existing data to create targeted campaigns and analyze performance metrics while maintaining data privacy.',
    icon: PieChart,
    features: ['Campaign Analytics', 'Audience Segmentation', 'Performance Tracking', 'Privacy-First Approach']
  },
  {
    title: 'Reporting Agent',
    description: 'Generate comprehensive reports and visualizations from your encrypted data, ensuring insights without exposure.',
    icon: FileBarChart,
    features: ['Custom Dashboards', 'Automated Reports', 'Real-time Analytics', 'Secure Data Visualization']
  },
  {
    title: 'Sales Agent',
    description: 'Optimize your sales process with AI-powered insights while keeping customer data protected and compliant.',
    icon: TrendingUp,
    features: ['Lead Scoring', 'Pipeline Analytics', 'Forecasting', 'Encrypted Customer Data']
  }
];

const ExploreAgents = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight mb-4"
        >
          Intelligent Agents for Your Business
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg"
        >
          Powerful AI agents designed to transform your business operations while maintaining security and privacy
        </motion.p>
      </div>

      {/* Agents Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2 border-border/50">
              <CardHeader className="space-y-1">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <agent.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{agent.title}</CardTitle>
                </div>
                <CardDescription className="text-base pt-4">
                  {agent.description}
                </CardDescription>
              </CardHeader>
              <Separator className="mx-6" />
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {agent.features.map((feature) => (
                    <Badge 
                      key={feature} 
                      variant="secondary"
                      className="px-3 py-1 text-sm"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExploreAgents;
