import { Injectable } from '@angular/core';
import { DataConnection, Peer } from "peerjs";
import { Message } from './app.model';
import { Store } from '@ngxs/store';
import { AddMessage, AddPeer, SetLocalPeerId } from './store/app.actions';
import { AppState } from './store/app.state';

type PeerDataType = 'peerId' | 'message';

interface PeerData {
  type: PeerDataType;
  senderPeerId: string;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PeerService {

  private peer = new Peer();
  private connections = new Map<string, DataConnection>();

  constructor(private store: Store) {
    this.peer.on('open', id => {
      console.log('My peer ID is: ' + id);
      this.store.dispatch(new SetLocalPeerId(id));
    })

    this.peer.on('connection', (conn) => {
      conn.on('open', this.handleOpen(conn));
      conn.on('data', this.onData(conn));
    });
  }

  connect(peerId: string) {
    const conn = this.peer.connect(peerId);
    conn.on('open', this.handleOpen(conn));
    conn.on('data', this.onData(conn));
  }

  sendMessage(toPeerId: string, messageText: string): Message | undefined {
    const conn = this.connections.get(toPeerId);
    const localPeerId = this.store.selectSnapshot(AppState.localPeerId);

    if (conn == null) {
      return undefined;
    }

    conn.send({type: 'message', senderPeerId: localPeerId, message: messageText} as PeerData);
    return {
      message: messageText,
      sender: localPeerId,
      timestamp: new Date().toISOString(),
    } as Message;
  }

  onData(conn: DataConnection): (data: unknown) => void {
    return (data: unknown) => {
      if (this.isPeerData(data)) {
        this.handleData(conn, data);
      }
    }
  }

  private handleData(conn: DataConnection, data: PeerData) {
    console.log(data, conn.peer);
    if (data.type === 'peerId') {
      this.connections.set(data.senderPeerId, conn);
      this.store.dispatch(new AddPeer(data.senderPeerId))
    } else if (data.type === 'message') {
      const message = {
        message: data.message,
        sender: data.senderPeerId,
        timestamp: new Date().toISOString(),
      } as Message;
      this.store.dispatch(new AddMessage(message));
    }
  }

  private handleOpen(conn: DataConnection): () => void {
    return () => {
      const localPeerId = this.store.selectSnapshot(AppState.localPeerId);
      conn.send({type: 'peerId', senderPeerId: localPeerId} as PeerData);
    }
  }

  isPeerData(data: unknown): data is PeerData {
    return (
      typeof data === 'object' &&
      data !== null &&
      data.hasOwnProperty('type')
    );
  }

}
