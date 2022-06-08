import { Injectable } from '@angular/core';
import { DataConnection, Peer } from "peerjs";
import { AppState } from './store/app.state';
import { Store } from '@ngrx/store';
import { addMessage, addPeer, setLocalPeerId } from './store/app.actions';
import { Message } from './app.model';

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
  private peerId = '';
  private connections = new Map<string, DataConnection>();

  constructor(private store: Store<AppState>) {
    this.peer.on('open', id => {
      console.log('My peer ID is: ' + id);
      this.peerId = id;
      this.store.dispatch(setLocalPeerId({peerId: id}));
    })

    this.peer.on('connection', (conn) => {
      conn.on('open', this.handleOpen(conn));
      conn.on('data', this.onData(conn));
    });
  }

  connect(peerId: string): void {
    const conn = this.peer.connect(peerId);
    conn.on('open', this.handleOpen(conn));
    conn.on('data', this.onData(conn));
  }

  sendMessage(toPeerId: string, messageText: string): Message | undefined {
    const conn = this.connections.get(toPeerId);
    if (conn == null) {
      return undefined
    }

    conn.send({type: 'message', senderPeerId: this.peerId, message: messageText} as PeerData);
    return {
      message: messageText,
      sender: this.peerId,
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
      this.store.dispatch(addPeer({peerId: data.senderPeerId}));
    } else if (data.type === 'message') {
      const message = {
        message: data.message,
        sender: data.senderPeerId,
        timestamp: new Date().toISOString(),
      } as Message;
      this.store.dispatch(addMessage({message}));
    }
  }

  private handleOpen(conn: DataConnection): () => void {
    return () => {
      conn.send({type: 'peerId', senderPeerId: this.peerId} as PeerData);
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
