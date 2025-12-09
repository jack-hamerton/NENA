
import { callService } from './callService';

function showIncomingCall(from: string, onAccept: () => void, onReject: () => void) {
  // Create the UI for the incoming call notification
  const notification = document.createElement('div');
  notification.className = 'incoming-call-notification';

  const message = document.createElement('p');
  message.textContent = `Incoming call from ${from}`;
  notification.appendChild(message);

  const acceptButton = document.createElement('button');
  acceptButton.textContent = 'Accept';
  acceptButton.onclick = () => {
    onAccept();
    notification.remove();
  };
  notification.appendChild(acceptButton);

  const rejectButton = document.createElement('button');
  rejectButton.textContent = 'Reject';
  rejectButton.onclick = () => {
    onReject();
    notification.remove();
  };
  notification.appendChild(rejectButton);

  document.body.appendChild(notification);
}

// Listen for incoming call events from the callService
callService.on('incomingCall', (from: string) => {
  showIncomingCall(
    from,
    () => {
      // When the user accepts the call, we'll use the callService to accept the call.
      // This will in turn handle the signaling and WebRTC connection.
      callService.acceptCall();
    },
    () => {
      // When the user rejects the call, we'll use the callService to reject the call.
      // This will handle the signaling to inform the other user that the call was rejected.
      callService.rejectCall();
    }
  );
});

