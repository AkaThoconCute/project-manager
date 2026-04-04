import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';
import { SocketConnectionState } from '../../types/store';

const socketConnectionSlice = createSlice({
  name: 'socketConnection',
  initialState: {} as SocketConnectionState,
  reducers: {
    socketConnectSuccess(state, action: PayloadAction<Socket>) {
      state.socket = action.payload;
    },
    socketConnectReset() {
      return {} as SocketConnectionState;
    },
  },
});

export const { socketConnectSuccess, socketConnectReset } = socketConnectionSlice.actions;
export const socketConnectionReducer = socketConnectionSlice.reducer;
