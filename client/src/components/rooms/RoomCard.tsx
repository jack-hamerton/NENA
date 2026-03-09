"use client";

import Link from "next/link";
import { Users, Radio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RoomCardProps {
  id: string;
  name: string;
  participants: number;
  isLive: boolean;
}

export function RoomCard({ id, name, participants, isLive }: RoomCardProps) {
  return (
    <Link href={`/rooms/${id}`}>
      <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer active:scale-[0.98]">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm leading-tight">{name}</h3>
            {isLive && (
              <Badge variant="destructive" className="gap-1 text-[10px] px-2 py-0 h-5">
                <Radio className="h-3 w-3 animate-pulse" /> LIVE
              </Badge>
            )}
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-5 w-5 rounded-full border-2 border-card bg-muted" />
              ))}
            </div>
            <span className="ml-2 font-medium">{participants} listening</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
