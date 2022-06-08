import { Component } from '@angular/core';
import { Message } from './app.model';
import { AppFacade } from './store/app.facade';

interface MessageUI extends Message {
  owner: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  peerId$ = this.facade.peerId$;
  peers$ = this.facade.peers$;
  messages$ = this.facade.messages$;

  constructor(private readonly facade: AppFacade) {
  }

  connectTo(toId: string) {
    this.facade.connectToPeer(toId);
  }

  onChange(event: any) {
    console.log(event.target.value);
  }

  messageTo(toPeer: string, message: string) {
    this.facade.sendMessage(toPeer, message);
  }
}
