import api from '@/lib/api';
import {
  Evento,
  CreateEventoPayload,
  UpdateEventoPayload,
  EventosResponse,
  EventoResponse
} from '@/types';

/**
 * Busca todos os eventos
 */
export const getEventos = async (): Promise<Evento[]> => {
  try {
    const response = await api.get<EventosResponse>('/evento');
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    throw error;
  }
};

/**
 * Busca um evento por ID
 */
export const getEventoById = async (id: number): Promise<Evento> => {
  try {
    const response = await api.get<EventoResponse>(`/evento/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Erro ao buscar evento ${id}:`, error);
    throw error;
  }
};

/**
 * Cria um novo evento
 */
export const createEvento = async (evento: CreateEventoPayload): Promise<Evento> => {
  try {
    const response = await api.post<EventoResponse>('/evento', evento);
    return response.data.data;
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    throw error;
  }
};

/**
 * Atualiza um evento
 */
export const updateEvento = async (id: number, evento: Partial<UpdateEventoPayload>): Promise<Evento> => {
  try {
    const response = await api.put<EventoResponse>(`/evento/${id}`, evento);
    return response.data.data;
  } catch (error) {
    console.error(`Erro ao atualizar evento ${id}:`, error);
    throw error;
  }
};

/**
 * Remove um evento
 */
export const deleteEvento = async (id: number): Promise<void> => {
  try {
    await api.delete(`/evento/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar evento ${id}:`, error);
    throw error;
  }
};