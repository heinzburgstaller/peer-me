import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { PeerService } from '../peer.service';
import { addMessage, connectedToPeerSuccess, connectToPeer, sendMessage, sendMessageFailed } from './app.actions';
import { map } from 'rxjs';

@Injectable()
export class AppEffects {

  connect$ = createEffect(() => this.actions$.pipe(
    ofType(connectToPeer),
    map((action) => {
      this.peerService.connect(action.toPeer);
      return connectedToPeerSuccess();
    }),
  ));

  send$ = createEffect(() => this.actions$.pipe(
    ofType(sendMessage),
    map((action) => {
      const message = this.peerService.sendMessage(action.toPeer, action.message);
      return message != null ? addMessage({message}) : sendMessageFailed();
    }),
  ));

  constructor(private actions$: Actions, private peerService: PeerService) {
  }

}
