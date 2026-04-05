import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';
import { type SocketConnectionState } from '../../types/store';

const socketConnectionSlice = createSlice({
  name: 'socketConnection',
  initialState: {} as SocketConnectionState,
  reducers: {
    socketConnectSuccess(_state, action: PayloadAction<Socket>) {
      return { socket: action.payload } as SocketConnectionState;
    },
    socketConnectReset() {
      return {} as SocketConnectionState;
    },
  },
});

export const { socketConnectSuccess, socketConnectReset } = socketConnectionSlice.actions;
export const socketConnectionReducer = socketConnectionSlice.reducer;
