import { Message } from '../app.model';

export class SetLocalPeerId {
  static readonly type = '[App] Set local peer ID';

  constructor(public peerId: string) {
  }
}

export class AddPeer {
  static readonly type = '[App] Add peer';

  constructor(public peerId: string) {
  }
}

export class AddMessage {
  static readonly type = '[App] Add message';

  constructor(public message: Message) {
  }
}

export class ConnectToPeer {
  static readonly type = '[App] Connect to peer';

  constructor(public peerId: string) {
  }
}

export class SendMessage {
  static readonly type = '[App] Send message';

  constructor(public toPeer: string, public message: string) {
  }
}
