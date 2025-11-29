import SockJS from 'sockjs-client';
import { Client, IFrame, IMessage } from '@stomp/stompjs';
import { getToken } from '@/utils/authUtils';

let stompClient: Client | null = null;

export const connect = (ticketId: string, onMessageReceived: (message: any) => void) => {
  console.log('🔌 Connecting to WebSocket for ticketId:', ticketId);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  console.log('WebSocket URL:', `${apiUrl}/ws`);
  const socket = new SockJS(`${apiUrl}/ws`);
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str: string) => console.log(str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = () => {
    console.log('✅ WebSocket connected successfully');
    console.log('Subscribing to topic:', `/topic/ticket-chat/${ticketId}`);
    stompClient?.subscribe(`/topic/ticket-chat/${ticketId}`, (message: IMessage) => {
      const receivedMessage = JSON.parse(message.body);
      console.log('📨 Received message:', receivedMessage);
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
    console.log('Connect headers set:', stompClient.connectHeaders);
  } else {
    console.warn('No token found in cookies');
  }

  console.log('Activating STOMP client for ticketId:', ticketId);
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
    console.log('Token from cookies:', token);

    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    console.log('Headers being sent:', headers);

    stompClient.publish({
      destination: `/app/ticket-chat.sendMessage/${ticketId}`,
      body: JSON.stringify(message),
      headers: headers
    });

    console.log('Message sent:', {
      destination: `/app/ticket-chat.sendMessage/${ticketId}`,
      body: JSON.stringify(message),
      headers: headers
    });
  } else {
    console.error('STOMP client not connected');
  }
};