import { createReducer, on } from '@ngrx/store';
import { addMessage, addPeer, setLocalPeerId } from './app.actions';
import { CoreState } from './app.state';

export const initialState: CoreState = {
  localPeerId: '',
  messages: [],
  peers: [],
};

export const coreReducer = createReducer(
  initialState,
  on(setLocalPeerId, (state, {peerId}) => ({...state, localPeerId: peerId})),
  on(addPeer, (state, {peerId}) => ({...state, peers: [...state.peers, peerId]})),
  on(addMessage, (state, {message}) => ({...state, messages: [...state.messages, message]})),
);
