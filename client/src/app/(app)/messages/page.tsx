"use client";

export default function MessagesPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/10">
      <div className="max-w-md space-y-4">
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="m3 21 1.9-1.9a9 9 0 1 1 2.8 2.8L3 21Z" />
            <path d="M9 10h6" />
            <path d="M9 14h6" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Your Messages</h2>
        <p className="text-muted-foreground">
          Select a conversation from the list or start a new one to begin chatting. 
          Everything is secure and ready for you.
        </p>
      </div>
    </div>
  );
}
