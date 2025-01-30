import io from 'socket.io-client';

class WebSocketService {
  static instance = null; // Singleton instance

  constructor() {
    if (WebSocketService.instance) {
      return WebSocketService.instance; // Return the existing instance
    }
    this.socket = null;
    WebSocketService.instance = this;
  }

  connect(url, onMessage, onError) {
    if (this.socket && this.socket.connected) {
      console.log('WebSocket already connected');
      return;
    }

    this.socket = io(url, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      timeout: 20000,
      extraHeaders: {
        "Access-Control-Allow-Origin": "*",  // Allow all origins
      }
    });

    // Connection and Disconnection Handlers
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    });

    // Register events dynamically and pass data to the provided callback
    this._registerEventListeners(onMessage);
  }

  _registerEventListeners(onMessage) {
    const events = [
      {
        name: 'video_frame_1',
        handler: (data) => {
          console.log('Received video_frame_1:', data.data); // Debugging statement
          onMessage && onMessage( {type: 'video_frame_1' ,data: data.data});
        }
      },
      {
        name: 'video_frame_2',
        handler: (data) => {
          console.log('Received video_frame_2:', data); // Debugging statement
          onMessage && onMessage({type: 'video_frame_2' ,data: data.data});
        }
      },
      {
        name: 'Alert',
        handler: (data) => {
          console.log('Received Alert:', data); // Debugging statement
          onMessage && onMessage({ type: 'Alert', alertData: data.data });
        }
      },
      {
        name: 'Threat',
        handler: (data) => {
          console.log('Received Threat:', data); // Debugging statement
          onMessage && onMessage({ type: 'Threat', threatData: data.data });
        }
      },
      // You can add more events here if needed
    ];

    // Register event handlers dynamically
    events.forEach((event) => {
      console.log(`Registering listener for: ${event.name}`); // Debugging statement
      this.socket.on(event.name, event.handler);
    });
  }

  // Emit event to the server
  emit(eventName, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(eventName, data);
      console.log(`Event emitted: ${eventName}`, data);
    } else {
      console.warn('WebSocket is not connected. Cannot emit event:', eventName);
    }
  }

  // Disconnect and clean up the socket instance
  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners(); // Clear all event listeners
      this.socket.disconnect();
      console.log('WebSocket disconnected manually');
      this.socket = null; // Reset socket instance
    }
  }
}

export default WebSocketService;
