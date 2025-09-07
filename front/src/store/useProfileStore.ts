import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AdvogadoProfile, ClienteProfile, ProfileState } from '@/types';

export const useProfileStore = create<ProfileState>()(
  devtools(
    (set) => ({
      profile: null,
      isAdvogado: false,
      isCliente: false,
      isComplete: false,
      isLoading: false,
      error: null,
      pendente: false,

      loadProfile: async () => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));

          const profileType = Math.random() > 0.5 ? 'advogado' : 'cliente';
          
          if (profileType === 'advogado') {
            const advogadoProfile: AdvogadoProfile = {
              id: '1',
              userId: '1',
              nome: 'Dr. João Silva',
              email: 'joao@example.com',
              telefone: '(11) 98765-4321',
              cpf: '123.456.789-01',
              dataNascimento: '1980-05-10',
              oab: 'OAB/SP 123456',
              bio: 'Advogado especialista em direito civil',
              formacao: 'Bacharel em Direito',
              faculdade: 'Universidade de São Paulo',
              areasAtuacao: ['Direito Civil', 'Direito Contratual'],
              avaliacao: 4.8
            };
            
            set({ 
              profile: advogadoProfile, 
              isAdvogado: true,
              isCliente: false,
              isComplete: true,
              isLoading: false 
            });
          } else {
            const clienteProfile: ClienteProfile = {
              id: '2',
              userId: '2',
              nome: 'Maria Souza',
              email: 'maria@example.com',
              telefone: '(11) 12345-6789',
              cpf: '987.654.321-00',
              dataNascimento: '1990-03-15'
            };
            
            set({ 
              profile: clienteProfile, 
              isAdvogado: false,
              isCliente: true,
              isComplete: true,
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erro ao carregar perfil',
            isLoading: false 
          });
        }
      },

      // Verificar completude do perfil
      checkProfileCompletion: async () => {
        set({ isLoading: true });
        try {
          // Simulação de chamada API
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Simulando resultado (70% de chance de perfil completo)
          const isComplete = Math.random() > 0.3;
          
          set({ isComplete, isLoading: false });
          return isComplete;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erro ao verificar perfil',
            isLoading: false 
          });
          return false;
        }
      },
      
      // Atualizar perfil
      updateProfile: async (updatedProfile: AdvogadoProfile | ClienteProfile) => {
        set({ isLoading: true });
        try {
          // Simulação de chamada API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ 
            profile: updatedProfile,
            isComplete: true,
            isLoading: false 
          });
          
          return updatedProfile;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erro ao atualizar perfil',
            isLoading: false 
          });
          throw error;
        }
      },
      
      // Limpar estado
      clearProfile: () => {
        set({ 
          profile: null, 
          isAdvogado: false,
          isCliente: false,
          isComplete: false,
          error: null 
        });
      }
    }),
    {
      name: 'profile-store',
    }
  )
); 