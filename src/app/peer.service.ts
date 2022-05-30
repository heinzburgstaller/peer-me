import { Injectable } from '@angular/core';
import { DataConnection, Peer } from "peerjs";
import { BehaviorSubject, Subject } from 'rxjs';

type PeerDataType = 'peerId' | 'message';

interface PeerData {
  type: PeerDataType;
  senderPeerId: string;
  message?: string;
}

export interface Message {
  message: string;
  sender: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class PeerService {

  private peer = new Peer();
  private connections = new Map<string, DataConnection>();
  public peerIdSubject = new BehaviorSubject('');
  public peersSubject = new BehaviorSubject([] as string[]);
  public messagesSubject = new BehaviorSubject([] as Message[]);

  constructor() {
    this.peer.on('open', id => {
      console.log('My peer ID is: ' + id);
      this.peerIdSubject.next(id);
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

  sendMessage(toPeerId: string, messageText: string) {
    const conn = this.connections.get(toPeerId);
    if (conn != null) {
      conn.send({type: 'message', senderPeerId: this.peerIdSubject.getValue(), message: messageText} as PeerData);
      const message = {
        message: messageText,
        sender: this.peerIdSubject.getValue(),
        timestamp: new Date().toISOString(),
      } as Message;
      this.messagesSubject.next([...this.messagesSubject.getValue(), message]);
    }
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
      this.peersSubject.next([...this.peersSubject.getValue(), data.senderPeerId]);
    } else if (data.type === 'message') {
      const message = {
        message: data.message,
        sender: data.senderPeerId,
        timestamp: new Date().toISOString(),
      } as Message;
      this.messagesSubject.next([...this.messagesSubject.getValue(), message]);
    }
  }

  private handleOpen(conn: DataConnection): () => void {
    return () => {
      conn.send({type: 'peerId', senderPeerId: this.peerIdSubject.getValue()} as PeerData);
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
