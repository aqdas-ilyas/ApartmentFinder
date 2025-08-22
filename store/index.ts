import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
export type Apartment = Tables['apartments']['Row'];
export type ApartmentImage = Tables['apartment_images']['Row'];
export type ApartmentFurniture = Tables['apartment_furniture']['Row'];
export type ApartmentLike = Tables['apartment_likes']['Row'];
export type OpenHouse = Tables['open_houses']['Row'];
export type OpenHouseRegistration = Tables['open_house_registrations']['Row'];

interface Store {
  apartments: (Apartment & {
    images: ApartmentImage[];
    furniture: ApartmentFurniture[];
    likes: ApartmentLike[];
    open_houses: (OpenHouse & {
      registrations: OpenHouseRegistration[];
    })[];
  })[];
  activeFilters: {
    petsAllowed?: boolean;
    smokingAllowed?: boolean;
    hasParking?: boolean;
    hasBalcony?: boolean;
    hasElevator?: boolean;
    rentalType?: 'room' | 'apartment' | 'sublet';
    priceRange?: { min: number; max: number };
    roomsRange?: { min: number; max: number };
    bombShelter?: 'apartment' | 'building' | '100meters' | 'none';
    city?: string;
    neighborhood?: string;
    entryDateFrom?: Date;
    entryDateTo?: Date;
  };
  loading: boolean;
  error: string | null;
  fetchApartments: () => Promise<void>;
  addApartment: (apartment: Omit<Apartment, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateApartment: (id: string, updates: Partial<Apartment>) => Promise<void>;
  deleteApartment: (id: string) => Promise<void>;
  toggleLike: (apartmentId: string, userId: string) => Promise<void>;
  setFilters: (filters: Store['activeFilters']) => void;
  clearFilters: () => void;
}

export const useStore = create<Store>((set, get) => ({
  apartments: [],
  activeFilters: {},
  loading: false,
  error: null,

  fetchApartments: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data: apartments, error } = await supabase
        .from('apartments')
        .select(`
          *,
          images:apartment_images(*),
          furniture:apartment_furniture(*),
          likes:apartment_likes(*),
          open_houses:open_houses(
            *,
            registrations:open_house_registrations(*)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ apartments, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addApartment: async (apartment) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('apartments')
        .insert([apartment])
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        apartments: [{ ...data, images: [], furniture: [], likes: [], open_houses: [] }, ...state.apartments],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateApartment: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('apartments')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        apartments: state.apartments.map((apt) =>
          apt.id === id ? { ...apt, ...updates } : apt
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteApartment: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('apartments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        apartments: state.apartments.filter((apt) => apt.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  toggleLike: async (apartmentId, userId) => {
    try {
      const apartment = get().apartments.find((apt) => apt.id === apartmentId);
      const isLiked = apartment?.likes.some((like) => like.user_id === userId);
      
      if (isLiked) {
        const { error } = await supabase
          .from('apartment_likes')
          .delete()
          .eq('apartment_id', apartmentId)
          .eq('user_id', userId);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('apartment_likes')
          .insert([{ apartment_id: apartmentId, user_id: userId }]);
          
        if (error) throw error;
      }
      
      set((state) => ({
        apartments: state.apartments.map((apt) => {
          if (apt.id === apartmentId) {
            return {
              ...apt,
              likes: isLiked
                ? apt.likes.filter((like) => like.user_id !== userId)
                : [...apt.likes, { id: Date.now().toString(), apartment_id: apartmentId, user_id: userId, created_at: new Date().toISOString() }],
            };
          }
          return apt;
        }),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  setFilters: (filters) => set({ activeFilters: filters }),
  clearFilters: () => set({ activeFilters: {} }),
}));