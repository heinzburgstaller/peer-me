import { AppState } from './app.state';
import { createSelector } from '@ngrx/store';

export const selectCore = (state: AppState) => state.core;

export const selectLocalPeerId = createSelector(selectCore, (core) => core.localPeerId);
export const selectPeers = createSelector(selectCore, (core) => core.peers);
export const selectMessages = createSelector(selectCore, (core) => core.messages);
