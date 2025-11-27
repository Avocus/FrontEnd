import SockJS from 'sockjs-client';
import { Client, IFrame, IMessage } from '@stomp/stompjs';

let stompClient: Client | null = null;

export const connect = (processId: string, onMessageReceived: (message: any) => void) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const socket = new SockJS(`${apiUrl}/ws`);
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str: string) => console.log(str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = () => {
    console.log('Connected to WebSocket');
    stompClient?.subscribe(`/topic/chat/${processId}`, (message: IMessage) => {
      const receivedMessage = JSON.parse(message.body);
      onMessageReceived(receivedMessage);
    });
  };

  stompClient.onStompError = (frame: IFrame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
  };

  // Adicionar headers de autenticação
  const token = localStorage.getItem('token');
  if (token) {
    stompClient.connectHeaders = {
      Authorization: `Bearer ${token}`
    };
  }

  stompClient.activate();
};

export const disconnect = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};

export const sendMessage = (processId: string, message: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: `/app/chat.sendMessage/${processId}`,
      body: JSON.stringify(message),
    });
  }
};