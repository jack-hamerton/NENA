# Nena Platform

This is a full-stack application with a React frontend and a Python backend.

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* npm
* Python 3.11
* Docker

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/your_project_name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Install Python packages
   ```sh
   pip install -r backend/requirements.txt
   ```

## Features

### Core Communication
*   **Messaging**: Send text, voice messages, GIFs, stickers, photos, and documents.
*   **Media Sharing**: Easily share photos and videos, including full-sized photos.
*   **Voice and Video Calls**: Private voice and video calls with screen sharing.
*   **Message Yourself**: A personal chat for notes and reminders.

### Advanced Privacy & Security
*   **Disappearing Messages**: Set messages to disappear after a specified duration.
*   **View Once**: Send photos and videos that vanish after being opened once.
*   **Chat Lock**: Password-protect specific conversations.
*   **Silence Unknown Callers**: Automatically screen out spam and unwanted calls.
*   **Two-Step Verification**: Add a unique PIN for account access.
*   **Privacy Controls**: Customize who sees your profile photo, "about" information, and online status.

### Convenience & Usability
*   **Cross-Platform Sync**: Real-time message synchronization across devices.
*   **Phone Notifications**: Receive new message alerts on your phone.
Line 49: *   **Phone Notifications**: Receive new message alerts on your phone.
Line 50: *   **Automatic Drafts**: Unfinished messages are saved automatically as drafts.
Line 51: *   **Nena AI**: Optionally use Nena AI for features like message summaries of unread chats, processed privately.
Line 52: *   **Advanced Privacy & Security**: While mentioned, specific features were not detailed in the provided documentation snippet.
Line 53: 
Line 54: ### NENA Rooms Features (Video Conferencing & Collaboration)
Line 55: 
Line 56: *   **Core Communication & Collaboration**:
Line 57:     *   **Video & Audio**: High-quality video conferencing with mute/unmute controls and dynamic speaker view.
Line 58:     *   **Screen Sharing**: Share entire desktops, specific applications, or whiteboards, with options for annotation and remote control.
Line 59:     *   **Chat**: In-meeting text chat, private messages, file sharing, and emojis.
Line 60:     *   **Recording**: Record meetings locally or to the cloud for later review.
Line 61: *   **Engagement & Interactivity**:
Line 62:     *   **Breakout Rooms**: Divide participants into smaller groups for focused discussions.
Line 63:     *   **Polling & Quizzes**: Launch surveys and tests to gather real-time feedback.
Line 64:     *   **Reactions & Emojis**: Provide non-verbal feedback during meetings.
Line 65:     *   **Virtual Backgrounds**: Use custom images or blur backgrounds for privacy or professionalism.
Line 66: *   **Accessibility & Productivity**:
Line 67:     *   **Live Transcription & Captions**: Automatic or manually managed closed captions and translations.
Line 68:     *   **NENA AI Companion**: Features like meeting summaries, smart recordings, and content generation.
Line 69:     *   **Immersive View**: Place participants into a shared virtual scene (e.g., classroom, boardroom).
Line 70:     *   **Calendar Integration**: Schedule and join meetings easily from existing calendars.
Line 71: *   **Security & Management (Host Controls)**:
Line 72:     *   **Waiting Room**: Control who enters the meeting.
Line 73:     *   **Lock Meeting**: Prevent new participants from joining.
Line 74:     *   **Participant Controls**: Manage participant audio (mute/unmute), video, and screen sharing.
Line 75:     *   **Security Icon**: Quick access to security settings.
Line 76: 
Line 77: ### Podcast Features
Line 78: 
Line 79: *   **Podcast Creation**: Users can create new podcasts, providing details such as title, description, and cover art. Audio files are stored (e.g., via S3).
Line 80: *   **Podcast Retrieval**: Individual podcasts can be retrieved by their ID.
Line 81: *   **Browsing and Listening**: A user interface allows for displaying a list of podcasts and playing them.
Line 82: 
Line 83: ### Calendar Features
Line 84: 
Line 85: *   **Calendar Display**: A visual calendar interface for viewing dates and events.
Line 86: *   **Event Management**:
Line 87:     *   **Event Creation**: Create new events.
Line 88:     *   **Event Viewing**: View event details (title, time range) for a selected date.
Line 89:     *   **Event Editing**: Modify existing events.
Line 90:     *   **Event Deletion**: Remove scheduled events.
Line 91: *   **Event Invitations**: Respond to event invitations.
Line 92: *   **Visual Cues**: Dates with events are visually marked (e.g., with an "❗️" badge).
Line 93: 
Line 94: ### Platform Features
Line 95: 
Line 96: *   **User Authentication**: Secure registration and login for users.
Line 97: *   **Activity Feed**: A feed displaying user posts and activities.
Line 98: *   **Notifications**: Real-time notifications for various events, with options to mark as read and clear read notifications.
Line 99: *   **Analytics Dashboard**: A comprehensive dashboard providing various insights:
Line 100:    *   **Engagement Metrics**: Overall user engagement.
Line 101:    *   **Content Type Performance**: Performance analysis of different content types.
Line 102:    *   **Top Posts**: Identification of high-performing posts.
Line 103:    *   **Hashtag Performance**: Analysis of hashtag effectiveness.
Line 104:    *   **Follower Analytics**: Data related to followers.
Line 105:    *   **Follower Activity**: Activity levels of followers by hour.
Line 106:    *   **Audience Interests**: Topics and engagement scores indicating audience interests.
Line 107:    *   **Influencers**: Identification of influential users and their engagement.
Line 108: *   **Future Enhancements**:
Line 109:    *   **AI-Powered Moderation**: Automated content moderation.
Line 106:     interests.
Line 107: *   **Influencers**: Identification of influential users and their engagement.
Line 108:
### Core Navigation & Modules (from `LeftNav.jsx`)
*   **Discover**: Explore new content and connections.
*   **Profile**: Manage personal user profiles.
*   **Messages**: Access direct and group messaging.
*   **Rooms**: Participate in video conferencing and collaboration rooms.
*   **Study**: Dedicated section for study-related activities.
*   **Music**: Access and manage music content.
*   **Analytics**: View project analytics and insights.
*   **Calendar**: Manage events and schedules.

### Messaging Features

*   **Core Communication**:
    *   **Text Messaging**: Send standard text messages.
    *   **Rich Media Messaging**: Ability to send voice messages, GIFs, stickers, photos, and documents.
    *   **Media Sharing**: Easily share photos and videos, including the ability to send full-sized photos.
    *   **Voice and Video Calls**: Engage in private voice and video calls, with screen sharing functionality during video calls.
    *   **Message Yourself**: Utilize a personal chat for notes, reminders, and messages, which can be pinned for quick access.
*   **Convenience & Usability**:
    *   **Cross-Platform Sync**: Real-time message synchronization across various devices.
    *   **Phone Notifications**: Receive alerts for new messages directly on your phone.
    *   **Automatic Drafts**: Unfinished messages are saved automatically as drafts.
*   **AI Integration**:
    *   **Nena AI**: Optionally use Nena AI for features like message summaries of unread chats, processed privately so no one else can see them.
*   **Advanced Privacy & Security**: While mentioned, specific features were not detailed in the provided documentation snippet.

### NENA Rooms Features (Video Conferencing & Collaboration)

*   **Core Communication & Collaboration**:
    *   **Video & Audio**: High-quality video conferencing with mute/unmute controls and dynamic speaker view.
    *   **Screen Sharing**: Share entire desktops, specific applications, or whiteboards, with options for annotation and remote control.
    *   **Chat**: In-meeting text chat, private messages, file sharing, and emojis.
    *   **Recording**: Record meetings locally or to the cloud for later review.
*   **Engagement & Interactivity**:
    *   **Breakout Rooms**: Divide participants into smaller groups for focused discussions.
    *   **Polling & Quizzes**: Launch surveys and tests to gather real-time feedback.
    *   **Reactions & Emojis**: Provide non-verbal feedback during meetings.
    *   **Virtual Backgrounds**: Use custom images or blur backgrounds for privacy or professionalism.
*   **Accessibility & Productivity**:
    *   **Live Transcription & Captions**: Automatic or manually managed closed captions and translations.
    *   **NENA AI Companion**: Features like meeting summaries, smart recordings, and content generation.
    *   **Immersive View**: Place participants into a shared virtual scene (e.g., classroom, boardroom).
    *   **Calendar Integration**: Schedule and join meetings easily from existing calendars.
*   **Security & Management (Host Controls)**:
    *   **Waiting Room**: Control who enters the meeting.
    *   **Lock Meeting**: Prevent new participants from joining.
    *   **Participant Controls**: Manage participant audio (mute/unmute), video, and screen sharing.
    *   **Security Icon**: Quick access to security settings.

### Podcast Features

*   **Podcast Creation**: Users can create new podcasts, providing details such as title, description, and cover art. Audio files are stored (e.g., via S3).
*   **Podcast Retrieval**: Individual podcasts can be retrieved by their ID.
*   **Browsing and Listening**: A user interface allows for displaying a list of podcasts and playing them.

### Calendar Features

*   **Calendar Display**: A visual calendar interface for viewing dates and events.
*   **Event Management**:
    *   **Event Creation**: Create new events.
    *   **Event Viewing**: View event details (title, time range) for a selected date.
    *   **Event Editing**: Modify existing events.
    *   **Event Deletion**: Remove scheduled events.
*   **Event Invitations**: Respond to event invitations.
*   **Visual Cues**: Dates with events are visually marked (e.g., with an "❗️" badge).

### Platform Features

*   **User Authentication**: Secure registration and login for users.
*   **Activity Feed**: A feed displaying user posts and activities.
*   **Notifications**: Real-time notifications for various events, with options to mark as read and clear read notifications.
*   **Analytics Dashboard**: A comprehensive dashboard providing various insights:
    *   **Engagement Metrics**: Overall user engagement.
    **Content Type Performance**: Performance analysis of different content types.
    *   **Top Posts**: Identification of high-performing posts.
    *   **Hashtag Performance**: Analysis of hashtag effectiveness.
    *   **Follower Analytics**: Data related to followers.
    *   **Follower Activity**: Activity levels of followers by hour.
    *   **Audience Interests**: Topics and engagement scores indicating audience interests.
*   **Future Enhancements**:
    *   **AI-Powered Moderation**: Automated content moderation.
