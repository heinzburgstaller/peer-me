import { createReducer, on } from '@ngrx/store';
import { Message } from '../app.model';
import { addMessage, addPeer, setLocalPeerId } from './app.actions';

export interface State {
  localPeerId: string;
  messages: Message[];
  peers: string[];
}

export const initialState: State = {
  localPeerId: '',
  messages: [],
  peers: [],
};

export const appReducer = createReducer(
  initialState,
  on(setLocalPeerId, (state, {peerId}) => ({...state, localPeerId: peerId})),
  on(addPeer, (state, {peerId}) => ({...state, peers: [...state.peers, peerId]})),
  on(addMessage, (state, {message}) => ({...state, messages: [...state.messages, message]})),
);
