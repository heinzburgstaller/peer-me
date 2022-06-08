import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { Message } from '../app.model';
import { connectToPeer, sendMessage } from './app.actions';
import { selectLocalPeerId, selectMessages, selectPeers } from './app.selector';
import { AppState } from './app.state';


@Injectable({
  providedIn: 'root',
})
export class AppFacade {
  peerId$ = this.store.select(selectLocalPeerId);
  peers$ = this.store.select(selectPeers);
  messages$ = this.store.select(selectMessages);

  constructor(private store: Store<AppState>) {
  }

  connectToPeer(toId: string) {
    this.store.dispatch(connectToPeer({toPeer: toId}));
  }

  sendMessage(toPeer: string, message: string) {
    this.store.dispatch(sendMessage({toPeer, message}));
  }
}
