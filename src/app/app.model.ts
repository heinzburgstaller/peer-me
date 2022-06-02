export interface Message {
  message: string;
  sender: string;
  timestamp: string;
}

export interface MessageUI extends Message {
  readonly owner: boolean;
}
