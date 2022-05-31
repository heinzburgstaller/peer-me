import { AppState } from './app.state';

export const selectLocalPeerId = (state: AppState) => state.app.localPeerId;
export const selectPeers = (state: AppState) => state.app.peers;
export const selectMessages = (state: AppState) => state.app.messages;
