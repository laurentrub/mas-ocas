export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = "super_admin" | "admin" | "conseiller";
export type VehicleFuel = "Essence" | "Diesel" | "Hybride" | "Électrique";
export type VehicleTransmission = "Manuelle" | "Automatique";
export type VehicleStatus =
  | "Disponible"
  | "Réservé"
  | "Livraison sous 48h"
  | "Vendu";
export type LeadType =
  | "devis"
  | "visite"
  | "contact"
  | "financement"
  | "livraison"
  | "rappel"
  | "reprise";
export type LeadStatus = "nouveau" | "en_cours" | "traite" | "archive";
export type PurchaseOrderStatus = "brouillon" | "envoye" | "paye" | "annule";

type Tables = {
  user_roles: {
    Row: {
      id: string;
      user_id: string;
      role: AppRole;
      created_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      role: AppRole;
      created_at?: string;
    };
    Update: {
      id?: string;
      user_id?: string;
      role?: AppRole;
      created_at?: string;
    };
    Relationships: [];
  };
  vehicles: {
    Row: {
      id: string;
      slug: string;
      brand: string;
      model: string;
      year: number;
      price: number;
      mileage: number;
      fuel: VehicleFuel;
      transmission: VehicleTransmission;
      power: string;
      color: string;
      doors: number;
      seats: number;
      status: VehicleStatus;
      highlight: string;
      description: string;
      editorial: string | null;
      features: string[];
      equipment_categories: Json | null;
      preparation: Json | null;
      import_origin: Json | null;
      warranty_note: string | null;
      image: string;
      image_alt: string;
      gallery: Json | null;
      facebook_post_id: string | null;
      source: string;
      created_by: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      slug: string;
      brand: string;
      model: string;
      year: number;
      price: number;
      mileage?: number;
      fuel?: VehicleFuel;
      transmission?: VehicleTransmission;
      power?: string;
      color?: string;
      doors?: number;
      seats?: number;
      status?: VehicleStatus;
      highlight?: string;
      description?: string;
      editorial?: string | null;
      features?: string[];
      equipment_categories?: Json | null;
      preparation?: Json | null;
      import_origin?: Json | null;
      warranty_note?: string | null;
      image?: string;
      image_alt?: string;
      gallery?: Json | null;
      facebook_post_id?: string | null;
      source?: string;
      created_by?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      slug?: string;
      brand?: string;
      model?: string;
      year?: number;
      price?: number;
      mileage?: number;
      fuel?: VehicleFuel;
      transmission?: VehicleTransmission;
      power?: string;
      color?: string;
      doors?: number;
      seats?: number;
      status?: VehicleStatus;
      highlight?: string;
      description?: string;
      editorial?: string | null;
      features?: string[];
      equipment_categories?: Json | null;
      preparation?: Json | null;
      import_origin?: Json | null;
      warranty_note?: string | null;
      image?: string;
      image_alt?: string;
      gallery?: Json | null;
      facebook_post_id?: string | null;
      source?: string;
      created_by?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: [];
  };
  leads: {
    Row: {
      id: string;
      type: LeadType;
      status: LeadStatus;
      name: string;
      email: string;
      phone: string | null;
      message: string | null;
      interest: string | null;
      vehicle_id: string | null;
      vehicle_slug: string | null;
      details: Json | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      type?: LeadType;
      status?: LeadStatus;
      name: string;
      email: string;
      phone?: string | null;
      message?: string | null;
      interest?: string | null;
      vehicle_id?: string | null;
      vehicle_slug?: string | null;
      details?: Json | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      type?: LeadType;
      status?: LeadStatus;
      name?: string;
      email?: string;
      phone?: string | null;
      message?: string | null;
      interest?: string | null;
      vehicle_id?: string | null;
      vehicle_slug?: string | null;
      details?: Json | null;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: [];
  };
  clients: {
    Row: {
      id: string;
      nom: string;
      prenom: string;
      email: string | null;
      telephone: string | null;
      adresse: string | null;
      code_postal: string | null;
      ville: string | null;
      pays: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      nom: string;
      prenom?: string;
      email?: string | null;
      telephone?: string | null;
      adresse?: string | null;
      code_postal?: string | null;
      ville?: string | null;
      pays?: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      nom?: string;
      prenom?: string;
      email?: string | null;
      telephone?: string | null;
      adresse?: string | null;
      code_postal?: string | null;
      ville?: string | null;
      pays?: string;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: [];
  };
  bank_accounts: {
    Row: {
      id: string;
      label: string;
      account_holder: string;
      bank_name: string | null;
      iban: string;
      bic: string | null;
      instructions: string | null;
      is_default: boolean;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      label: string;
      account_holder: string;
      bank_name?: string | null;
      iban: string;
      bic?: string | null;
      instructions?: string | null;
      is_default?: boolean;
      is_active?: boolean;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      label?: string;
      account_holder?: string;
      bank_name?: string | null;
      iban?: string;
      bic?: string | null;
      instructions?: string | null;
      is_default?: boolean;
      is_active?: boolean;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: [];
  };
  purchase_orders: {
    Row: {
      id: string;
      numero: string;
      client_id: string | null;
      vehicle_id: string | null;
      vehicle_label: string | null;
      amount: number;
      deposit: number;
      balance: number;
      payment_method: string;
      bank_account_id: string | null;
      status: PurchaseOrderStatus;
      notes: string | null;
      delivery_date: string | null;
      delivery_place: string | null;
      created_by: string | null;
      created_at: string;
      updated_at: string;
      installment_count: number | null;
      installment_schedule: Json | null;
    };
    Insert: {
      id?: string;
      numero: string;
      client_id?: string | null;
      vehicle_id?: string | null;
      vehicle_label?: string | null;
      amount?: number;
      deposit?: number;
      payment_method?: string;
      bank_account_id?: string | null;
      status?: PurchaseOrderStatus;
      notes?: string | null;
      delivery_date?: string | null;
      delivery_place?: string | null;
      created_by?: string | null;
      created_at?: string;
      updated_at?: string;
      installment_count?: number | null;
      installment_schedule?: Json | null;
    };
    Update: {
      id?: string;
      numero?: string;
      client_id?: string | null;
      vehicle_id?: string | null;
      vehicle_label?: string | null;
      amount?: number;
      deposit?: number;
      payment_method?: string;
      bank_account_id?: string | null;
      status?: PurchaseOrderStatus;
      notes?: string | null;
      delivery_date?: string | null;
      delivery_place?: string | null;
      created_by?: string | null;
      created_at?: string;
      updated_at?: string;
      installment_count?: number | null;
      installment_schedule?: Json | null;
    };
    Relationships: [];
  };
};

export type Database = {
  public: {
    Tables: Tables;
    Views: Record<string, never>;
    Functions: {
      has_role: {
        Args: { _user_id: string; _role: AppRole };
        Returns: boolean;
      };
      is_staff: { Args: { _user_id: string }; Returns: boolean };
      is_admin_or_above: { Args: { _user_id: string }; Returns: boolean };
      next_purchase_order_numero: { Args: Record<string, never>; Returns: string };
    };
    Enums: {
      app_role: AppRole;
      vehicle_fuel: VehicleFuel;
      vehicle_transmission: VehicleTransmission;
      vehicle_status: VehicleStatus;
      lead_type: LeadType;
      lead_status: LeadStatus;
      purchase_order_status: PurchaseOrderStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type VehicleRow = Tables["vehicles"]["Row"];
export type LeadRow = Tables["leads"]["Row"];
export type ClientRow = Tables["clients"]["Row"];
export type BankAccountRow = Tables["bank_accounts"]["Row"];
export type PurchaseOrderRow = Tables["purchase_orders"]["Row"];
