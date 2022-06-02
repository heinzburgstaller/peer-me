import { Message } from '../app.model';

export interface CoreState {
  localPeerId: string;
  messages: Message[];
  peers: string[];
}

export interface AppState {
  core: CoreState;
}
