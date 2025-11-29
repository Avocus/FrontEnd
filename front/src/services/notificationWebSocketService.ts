import SockJS from 'sockjs-client';
import { Client, IFrame, IMessage } from '@stomp/stompjs';
import { getToken } from '@/utils/authUtils';

let stompClient: Client | null = null;
let isConnected = false;

export const connectNotifications = (userId: string, onNotificationReceived: (notification: any) => void) => {
  if (isConnected) {
    console.log('WebSocket already connected for notifications');
    return;
  }

  console.log('🔌 Connecting to WebSocket for notifications, userId:', userId);
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
    console.log('✅ WebSocket connected successfully for notifications');
    isConnected = true;
    console.log('Subscribing to topic:', `/topic/notificacoes/${userId}`);
    stompClient?.subscribe(`/topic/notificacoes/${userId}`, (message: IMessage) => {
      const receivedNotification = JSON.parse(message.body);
      console.log('📨 Received notification:', receivedNotification);
      onNotificationReceived(receivedNotification);
    });
  };

  stompClient.onDisconnect = () => {
    console.log('❌ WebSocket disconnected for notifications');
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
    console.log('Connect headers set:', stompClient.connectHeaders);
  } else {
    console.warn('No token found in cookies');
  }

  console.log('Activating STOMP client for notifications');
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