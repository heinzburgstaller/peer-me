import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Message } from '../app.model';
import { AddMessage, AddPeer, ConnectToPeer, SendMessage, SetLocalPeerId } from './app.actions';
import { PeerService } from '../peer.service';

export interface AppStateModel {
  localPeerId: string;
  messages: Message[];
  peers: string[];
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    localPeerId: '',
    messages: [],
    peers: [],
  },
})
@Injectable()
export class AppState {

  @Selector()
  static localPeerId(state: AppStateModel) {
    return state.localPeerId;
  }

  @Selector()
  static peers(state: AppStateModel) {
    return state.peers;
  }

  @Selector()
  static messages(state: AppStateModel) {
    return state.messages;
  }

  constructor(private peerService: PeerService) {
  }

  @Action(SetLocalPeerId)
  setLocalPeerId({patchState}: StateContext<AppStateModel>, action: SetLocalPeerId) {
    patchState({localPeerId: action.peerId});
  }

  @Action(AddPeer)
  addPeer({getState, patchState}: StateContext<AppStateModel>, action: AddPeer) {
    patchState({peers: [...getState().peers, action.peerId]});
  }

  @Action(AddMessage)
  addMessage({getState, patchState}: StateContext<AppStateModel>, action: AddMessage) {
    patchState({messages: [...getState().messages, action.message]});
  }

  @Action(ConnectToPeer)
  connectToPeer(_state: StateContext<AppStateModel>, action: ConnectToPeer) {
    this.peerService.connect(action.peerId);
  }

  @Action(SendMessage)
  sendMessage({dispatch}: StateContext<AppStateModel>, action: SendMessage) {
    const message = this.peerService.sendMessage(action.toPeer, action.message);
    if (message == null) {
      return;
    }
    dispatch(new AddMessage(message));
  }

}
