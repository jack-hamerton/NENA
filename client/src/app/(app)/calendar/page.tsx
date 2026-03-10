"use client";

import { useState, useEffect } from "react";
import { calendarService } from "@/services/calendar.service";
import { CalendarEvent, EventCreate, ConflictDetail } from "@/types/calendar";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { EventDialog } from "@/components/calendar/EventDialog";
import { Loader2, Plus, Calendar as CalendarIcon, Filter, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [conflict, setConflict] = useState<ConflictDetail | null>(null);

  const fetchEvents = async () => {
    try {
      const data = await calendarService.getEvents();
      setEvents(data || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setConflict(null);
    setIsDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(new Date(event.start_time));
    setConflict(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
    setConflict(null);
  };

  const handleSubmitEvent = async (data: EventCreate) => {
    try {
      if (selectedEvent) {
        await calendarService.updateEvent(selectedEvent.id, data);
      } else {
        await calendarService.createEvent(data);
      }
      await fetchEvents();
      handleCloseDialog();
    } catch (error: any) {
      if (error.response?.status === 409) {
        setConflict(error.response.data.detail);
      } else {
        console.error("Failed to save event:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden p-8 gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">CALENDAR HUB</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-lg font-medium leading-relaxed">
            Manage your professional sessions, synchronized meetings, and collaborative schedules in one unified space.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold gap-2 px-6 h-11 border-white/5 bg-accent/20">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button variant="outline" className="rounded-xl font-bold gap-2 px-6 h-11 border-white/5 bg-accent/20">
            <Layers className="h-4 w-4" /> View Options
          </Button>
          <Button 
            className="font-black italic gap-2 px-8 h-11 rounded-xl shadow-lg shadow-primary/20 tracking-tight"
            onClick={() => handleDateClick(new Date())}
          >
            <Plus className="h-5 w-5" /> NEW SESSION
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 min-h-0">
        <CalendarGrid 
          events={events} 
          onDateClick={handleDateClick} 
          onEventClick={handleEventClick} 
        />
      </div>

      <EventDialog 
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitEvent}
        selectedDate={selectedDate}
        initialEvent={selectedEvent}
        conflict={conflict}
      />
    </div>
  );
}
