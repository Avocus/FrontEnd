import SockJS from 'sockjs-client';
import { Client, IFrame, IMessage } from '@stomp/stompjs';
import { getToken } from '@/utils/authUtils';

let stompClient: Client | null = null;
let isConnected = false;

export const connectNotifications = (userId: string, onNotificationReceived: (notification: any) => void) => {
  if (isConnected) {
    return;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const socket = new SockJS(`${apiUrl}/ws`);

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = () => {
    isConnected = true;
    stompClient?.subscribe(`/topic/notificacoes/${userId}`, (message: IMessage) => {
      const receivedNotification = JSON.parse(message.body);
      onNotificationReceived(receivedNotification);
    });
  };

  stompClient.onDisconnect = () => {
    isConnected = false;
  };

  stompClient.onStompError = (frame: IFrame) => {
    console.error('❌ STOMP Error:', frame.headers['message']);
    console.error('❌ STOMP Error details:', frame.body);
    isConnected = false;
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

export const disconnectNotifications = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    isConnected = false;
  }
};

export const isNotificationsConnected = () => isConnected;