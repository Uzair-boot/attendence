// config/socket.js
import {io} from 'socket.io-client';

// const SOCKET_URL = 'wss://darkoi.org:5002';
const SOCKET_URL = 'http://101.53.242.10:5002';


const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnectionAttempts: 5,
  timeout: 10000,
});

export default socket;
