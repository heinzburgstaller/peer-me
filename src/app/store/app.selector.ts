import { AppState } from './app.state';
import { createSelector } from '@ngrx/store';
import { MessageUI } from '../app.model';

export const selectCore = (state: AppState) => state.core;

export const selectLocalPeerId = createSelector(selectCore, (core) => core.localPeerId);
export const selectPeers = createSelector(selectCore, (core) => core.peers);
export const selectMessages = createSelector(selectCore, (core) => {
  return core.messages.map(m => ({
    message: m.message,
    sender: m.sender,
    timestamp: m.timestamp,
    owner: core.localPeerId === m.sender,
  } as MessageUI))
});
