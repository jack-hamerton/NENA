
// Mock service for managing meetings

class MeetingService {
  constructor() {
    this.meetings = {}; // In-memory storage for meetings
  }

  // Create a new meeting and return a unique code
  createMeeting({ title, dateTime, agenda, createdBy }) {
    const meetingCode = Math.random().toString(36).substring(2, 10).toUpperCase(); // 8-digit code
    const meeting = {
      id: meetingCode,
      title,
      dateTime,
      agenda,
      createdBy,
      participants: [createdBy],
    };
    this.meetings[meetingCode] = meeting;
    console.log('[MeetingService] Meeting created:', meeting);
    return Promise.resolve({ meetingCode, meeting });
  }

  // Get meeting details by code
  getMeeting(meetingCode) {
    const meeting = this.meetings[meetingCode];
    if (meeting) {
      console.log(`[MeetingService] Fetched meeting ${meetingCode}:`, meeting);
      return Promise.resolve(meeting);
    } else {
      console.error(`[MeetingService] Meeting with code ${meetingCode} not found.`);
      return Promise.reject('Meeting not found');
    }
  }

  // Add a user to a meeting
  joinMeeting(meetingCode, userId) {
    const meeting = this.meetings[meetingCode];
    if (meeting && !meeting.participants.includes(userId)) {
      meeting.participants.push(userId);
      console.log(`[MeetingService] User ${userId} joined meeting ${meetingCode}`);
      return Promise.resolve(meeting);
    } else if (!meeting) {
        return Promise.reject('Meeting not found');
    }
    return Promise.resolve(meeting); // User already in the meeting
  }

    // Get meetings for a specific user
  getUserMeetings(userId) {
    const userMeetings = Object.values(this.meetings).filter(meeting => 
        meeting.createdBy === userId || meeting.participants.includes(userId)
    );
    console.log(`[MeetingService] Fetched meetings for user ${userId}:`, userMeetings);
    return Promise.resolve(userMeetings);
  }
}

export const meetingService = new MeetingService();
