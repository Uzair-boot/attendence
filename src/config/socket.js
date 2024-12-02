// config/socket.js
import {io} from 'socket.io-client';
import {SOCKET_URL} from '../api/handleApi';

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnectionAttempts: 5,
  timeout: 10000,
});

export default socket;
