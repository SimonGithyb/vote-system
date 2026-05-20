import { io } from 'socket.io-client';
import config from '@/config';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(config.API_URL.replace('/api', '')); // Assuming API_URL has /api suffix
      
      this.socket.on('connect', () => {
        console.log('Connected to WebSocket');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.socket) this.connect();
    this.socket.on(event, callback);
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export default new SocketService();
