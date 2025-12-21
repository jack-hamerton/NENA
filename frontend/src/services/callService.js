class CallService {
  startCall(user) {
    // In a real app, this would use WebRTC to start a call
    console.log(`Calling ${user}...`);
  }
}

export const callService = new CallService();
