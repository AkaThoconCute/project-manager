import { io, Socket } from 'socket.io-client';
import { isFakeMode, API_URL } from '../config/env';

function createFakeSocket(): Socket {
  const noop = () => fakeSocket;
  const fakeSocket = {
    on: noop,
    off: noop,
    emit: noop,
    connect: noop,
    disconnect: noop,
    connected: true,
    id: 'fake-socket-id',
  } as unknown as Socket;
  return fakeSocket;
}

export function connectSocket(token: string): Socket {
  if (isFakeMode()) {
    return createFakeSocket();
  }

  return io(API_URL, {
    transports: ['websocket', 'polling'],
    auth: {
      authorization: `Bearer ${token}`,
    },
  });
}

export function disconnectSocket(socket: Socket): void {
  socket.disconnect();
}
