import SockJS from 'sockjs-client';
import { Client, IFrame, IMessage } from '@stomp/stompjs';
import { getToken } from '@/utils/authUtils';

let stompClient: Client | null = null;

export const connect = (ticketId: string, onMessageReceived: (message: any) => void) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const socket = new SockJS(`${apiUrl}/ws`);
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = () => {
    stompClient?.subscribe(`/topic/ticket-chat/${ticketId}`, (message: IMessage) => {
      const receivedMessage = JSON.parse(message.body);
      onMessageReceived(receivedMessage);
    });
  };

  stompClient.onStompError = (frame: IFrame) => {
    console.error('❌ STOMP Error:', frame.headers['message']);
    console.error('❌ STOMP Error details:', frame.body);
    console.error('❌ Full frame:', frame);
  };

  // Adicionar headers de autenticação
  const token = getToken();
  if (token) {
    stompClient.connectHeaders = {
      Authorization: `Bearer ${token}`
    };
  } else {
    console.warn('No token found in cookies');
  }

  stompClient.activate();
};

export const disconnect = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};

export const sendMessage = (ticketId: string, message: any) => {
  if (stompClient && stompClient.connected) {
    const token = getToken();

    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    stompClient.publish({
      destination: `/app/ticket-chat.sendMessage/${ticketId}`,
      body: JSON.stringify(message),
      headers: headers
    });
  } else {
    console.error('STOMP client not connected');
  }
};