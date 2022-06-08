import { createAction, props } from '@ngrx/store';
import { Message } from '../app.model';

export const setLocalPeerId = createAction('[App] Set local peer ID', props<{ peerId: string }>());
export const addPeer = createAction('[App] Add peer', props<{ peerId: string }>());
export const addMessage = createAction('[App] Add message', props<{ message: Message }>());
export const connectToPeer = createAction('[App] Connect to peer', props<{ toPeer: string }>());
export const sendMessage = createAction('[App] Send message', props<{ toPeer: string, message: string }>());
export const sendMessageFailed = createAction('[App] Send message failed');
export const connectedToPeerSuccess = createAction('[App] Connect to peer succeeded');
