import { Component } from '@angular/core';
import { PeerService } from './peer.service';
import { combineLatest, map, Observable } from 'rxjs';
import { Message } from './app.model';

interface MessageUI extends Message {
  owner: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'peer-me';
  selectedPeer = '';

  peerId$ = this.peerService.peerIdSubject.asObservable();
  peers$ = this.peerService.peersSubject.asObservable();
  messages$: Observable<MessageUI[]>;

  constructor(private peerService: PeerService) {
    this.messages$ = combineLatest([this.peerId$, this.peerService.messagesSubject.asObservable()]).pipe(
      map(([peerId, messages]) => {
        return messages.map(m => {
          return {message: m.message, sender: m.sender, timestamp: m.timestamp, owner: peerId === m.sender}
        });
      }),
    );
  }

  connectTo(toId: string) {
    this.peerService.connect(toId);
  }

  onChange(event: any) {
    console.log(event.target.value);
  }

  messageTo(toPeer: string, message: string) {
    this.peerService.sendMessage(toPeer, message);
  }

}
