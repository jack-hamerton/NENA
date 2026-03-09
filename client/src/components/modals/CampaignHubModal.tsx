"use client";

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, MessageSquare, Users, History, Settings, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CampaignHubModalProps {
  campaignName: string | null;
  open: boolean;
  onClose: () => void;
}

// Mock API for Campaign data
const fetchCampaignData = async (name: string): Promise<CampaignData> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const mockData: Record<string, CampaignData> = {
    KiberaSafePassage: {
      title: "Secure Our Streets: #KiberaSafePassage",
      mission: "Installation of 50 new solar-powered streetlights along the main walkway to ensure safe passage for all residents after dark.",
      creatorId: "1",
      links: { 
        room: { url: '/rooms/kibera-safe-passage', enabled: true }, 
        messages: { url: '/messages/campaign-kibera', enabled: true } 
      },
      plan: [
        { text: "Collect 500 signatures for our online petition.", completed: true },
        { text: "Secure a meeting with the local County official.", completed: false },
        { text: "Host a community town hall meeting.", completed: false }
      ],
      challenges: [
        { title: "Fundraising Challenge", description: "Raise $5,000 for the solar panels.", progress: 0.6, goal: 5000, current: 3000, unit: '$' },
        { title: "Petition Signatures", description: "Gather 500 signatures from local residents.", progress: 1.0, goal: 500, current: 712, unit: 'signatures' }
      ],
      updates: [
        "Great news! Our meeting with the MCA has been scheduled for next Tuesday.",
        "We've reached over 700 signatures! The community's voice is strong."
      ],
      supporters: 1245,
      impact: 87,
    }
  };
  return mockData[name] || mockData['KiberaSafePassage'];
};

interface CampaignData {
  title: string;
  mission: string;
  creatorId: string;
  links: {
    room: { url: string; enabled: boolean };
    messages: { url: string; enabled: boolean };
  };
  plan: { text: string; completed: boolean }[];
  challenges: { title: string; description: string; progress: number; goal: number; current: number; unit: string }[];
  updates: string[];
  supporters: number;
  impact: number;
}

const CampaignHubModal: React.FC<CampaignHubModalProps> = ({ campaignName, open, onClose }) => {
  const [activeTab, setActiveTab] = useState('plan');
  const [data, setData] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && campaignName) {
      setLoading(true);
      fetchCampaignData(campaignName).then(res => {
        setData(res);
        setLoading(false);
      });
    }
  }, [open, campaignName]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm sm:items-center p-0 sm:p-4">
      <div className="relative w-full max-w-2xl bg-card border shadow-2xl rounded-t-2xl sm:rounded-2xl h-[85vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="nena" className="px-2 py-0">Campaign Hub</Badge>
              {data && <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> {data.supporters} supporters</span>}
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{data?.title || campaignName}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : data ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Mission Statement */}
              <div className="space-y-2">
                <p className="text-muted-foreground leading-relaxed">
                  {data.mission}
                </p>
                <div className="flex gap-4 pt-2">
                  <Button className="flex-1 gap-2 border-primary/20" variant="outline">
                    <ExternalLink className="h-4 w-4" /> Go to Room
                  </Button>
                  <Button className="flex-1 gap-2 border-primary/20" variant="outline">
                    <MessageSquare className="h-4 w-4" /> Message Group
                  </Button>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-border/50 gap-6">
                {[
                  { id: 'plan', label: 'The Plan', icon: Target },
                  { id: 'challenges', label: 'Challenges', icon: Zap },
                  { id: 'updates', label: 'Updates', icon: History },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "pb-3 text-sm font-medium transition-colors relative flex items-center gap-2",
                      activeTab === tab.id ? "text-primary px-1" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'plan' && (
                  <ul className="space-y-4">
                    {data.plan?.map((item, idx) => (
                      <li key={idx} className="flex gap-3 items-start group">
                        <div className={cn(
                          "mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                          item.completed ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30"
                        )}>
                          {item.completed && <div className="h-2 w-2 rounded-full bg-current" />}
                        </div>
                        <span className={cn(
                          "text-sm leading-relaxed transition-colors",
                          item.completed ? "text-muted-foreground line-through" : "text-foreground"
                        )}>
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'challenges' && (
                  <div className="space-y-6">
                    {data.challenges?.map((challenge, idx) => (
                      <Card key={idx} className="p-4 border-primary/10 bg-primary/5 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-sm">{challenge.title}</h4>
                            <p className="text-xs text-muted-foreground">{challenge.description}</p>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">
                            {challenge.unit === '$' ? '$' : ''}{challenge.current.toLocaleString()}/{challenge.goal.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500 rounded-full" 
                            style={{ width: `${Math.min(100, challenge.progress * 100)}%` }}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === 'updates' && (
                  <div className="space-y-4">
                    {data.updates?.map((update, idx) => (
                      <div key={idx} className="border-l-2 border-primary/30 pl-4 py-1">
                        <p className="text-sm text-muted-foreground italic leading-relaxed">
                          &quot; {update} &quot;
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Moderation & Access</p>
                    <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Allow anyone to join the room</span>
                        <div className="h-5 w-10 bg-primary rounded-full relative"><div className="absolute right-1 top-1 h-3 w-3 bg-white rounded-full shadow-sm" /></div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Pinned room in group messages</span>
                         <div className="h-5 w-10 bg-muted rounded-full relative border"><div className="absolute left-1 top-1 h-3 w-3 bg-white rounded-full shadow-sm border" /></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t bg-muted/20">
               <Button className="w-full text-base font-bold h-12 shadow-lg hover:shadow-primary/20 transition-all" variant="nena">
                 Support this Campaign
               </Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CampaignHubModal;
