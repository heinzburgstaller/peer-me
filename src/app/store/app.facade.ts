import { Injectable } from '@angular/core';
import { Message } from '../app.model';
import { AppState } from './app.state';
import { Store } from '@ngxs/store';
import { combineLatest, map } from 'rxjs';
import { ConnectToPeer, SendMessage } from './app.actions';

interface MessageUI extends Message {
  readonly owner: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AppFacade {

  localPeerId$ = this.store.select(AppState.localPeerId);
  peers$ = this.store.select(AppState.peers);
  messages$ = combineLatest([this.localPeerId$, this.store.select(AppState.messages)]).pipe(
    map(([localPeerId, messages]) =>
      messages.map(m => ({...m, owner: m.sender === localPeerId} as MessageUI))),
  );

  constructor(private store: Store) {
  }

  connectToPeer(toId: string) {
    this.store.dispatch(new ConnectToPeer(toId));
  }

  sendMessage(toPeer: string, message: string) {
    this.store.dispatch(new SendMessage(toPeer, message));
  }

}
