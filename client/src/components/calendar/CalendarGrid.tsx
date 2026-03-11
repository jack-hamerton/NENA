"use client";

import { useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from "date-fns";
import { CalendarEvent } from "@/types/calendar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarGrid({ events, onDateClick, onEventClick }: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.start_time), day));
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-3xl border shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b bg-accent/5">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black tracking-tight uppercase italic">{format(currentMonth, "MMMM yyyy")}</h2>
          <p className="text-xs text-muted-foreground font-semibold">Collaborative schedule view</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl px-4 font-bold" onClick={() => setCurrentMonth(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 bg-accent/10 border-b">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {calendarDays.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[100px] p-2 border-r border-b last:border-r-0 relative group transition-colors",
                !isCurrentMonth ? "bg-accent/5 opacity-40" : "hover:bg-primary/5",
                isCurrentMonth && "bg-card"
              )}
              onClick={() => onDateClick(day)}
            >
              <div className="flex items-center justify-between mb-2">
                 <span className={cn(
                   "text-sm font-bold h-7 w-7 flex items-center justify-center rounded-full transition-all",
                   isCurrentDay ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "text-muted-foreground group-hover:text-foreground"
                 )}>
                   {format(day, "d")}
                 </span>
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDateClick(day);
                    }}
                 >
                   <Plus className="h-3 w-3" />
                 </Button>
              </div>

              <div className="space-y-1.5 overflow-y-auto max-h-[80px] scrollbar-hide">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="w-full text-left p-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    <p className="text-[10px] font-bold text-primary truncate">{format(new Date(event.start_time), "HH:mm")} {event.title}</p>
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-[10px] text-muted-foreground font-bold pl-1">
                    + {dayEvents.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
