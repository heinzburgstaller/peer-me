import { Component } from '@angular/core';
import { AppFacade } from './store/app.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  peerId$ = this.facade.localPeerId$;
  peers$ = this.facade.peers$;
  messages$ = this.facade.messages$;

  constructor(private facade: AppFacade) {

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
