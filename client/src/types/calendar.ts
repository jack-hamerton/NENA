export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  owner_id: string;
  collaborators?: {
    id: string;
    username: string;
  }[];
}

export interface EventCreate {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  collaborator_ids?: string[];
}

export interface ConflictSlot {
  start: string;
  end: string;
}

export interface ConflictDetail {
  message: string;
  available_slots: ConflictSlot[];
}
