import { io } from 'socket.io-client';
import { SERVER_URL } from './api';

let socket = null;

// A single shared socket connection for the whole app, created once the user logs in.
export const connectSocket = (userId) => {
  if (socket?.connected) return socket;

  socket = io(SERVER_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    socket.emit('identify', userId);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
