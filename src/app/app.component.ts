import { Component } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectLocalPeerId, selectMessages, selectPeers } from './store/app.selector';
import { AppState } from './store/app.state';
import { Message } from './app.model';
import { connectToPeer, sendMessage } from './store/app.actions';

interface MessageUI extends Message {
  owner: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  peerId$ = this.store.select(selectLocalPeerId);
  peers$ = this.store.select(selectPeers);
  messages$: Observable<MessageUI[]>;

  constructor(private store: Store<AppState>) {
    this.messages$ = combineLatest([this.peerId$, this.store.select(selectMessages)]).pipe(
      map(([peerId, messages]) => {
        return messages.map(m => {
          return {message: m.message, sender: m.sender, timestamp: m.timestamp, owner: peerId === m.sender}
        });
      }),
    );
  }

  connectTo(toId: string) {
    this.store.dispatch(connectToPeer({toPeer: toId}));
  }

  onChange(event: any) {
    console.log(event.target.value);
  }

  messageTo(toPeer: string, message: string) {
    this.store.dispatch(sendMessage({toPeer, message}));
  }

}
