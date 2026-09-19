-- MAS OCAS AUTO — back-office schema
-- Roles, vehicles, leads, clients, bank_accounts, purchase_orders + RLS

-- ── Roles ──────────────────────────────────────────────────────────────────
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'conseiller');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'admin', 'conseiller')
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_above(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'admin')
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- ── Vehicles ───────────────────────────────────────────────────────────────
CREATE TYPE public.vehicle_fuel AS ENUM ('Essence', 'Diesel', 'Hybride', 'Électrique');
CREATE TYPE public.vehicle_transmission AS ENUM ('Manuelle', 'Automatique');
CREATE TYPE public.vehicle_status AS ENUM ('Disponible', 'Réservé', 'Livraison sous 48h', 'Vendu');

CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  mileage INTEGER NOT NULL DEFAULT 0,
  fuel public.vehicle_fuel NOT NULL DEFAULT 'Essence',
  transmission public.vehicle_transmission NOT NULL DEFAULT 'Manuelle',
  power TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '',
  doors INTEGER NOT NULL DEFAULT 5,
  seats INTEGER NOT NULL DEFAULT 5,
  status public.vehicle_status NOT NULL DEFAULT 'Disponible',
  highlight TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  editorial TEXT,
  features TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  equipment_categories JSONB,
  preparation JSONB,
  import_origin JSONB,
  warranty_note TEXT,
  image TEXT NOT NULL DEFAULT '',
  image_alt TEXT NOT NULL DEFAULT '',
  gallery JSONB,
  facebook_post_id TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_vehicles_brand ON public.vehicles(brand);
CREATE INDEX idx_vehicles_price ON public.vehicles(price);
CREATE INDEX idx_vehicles_facebook ON public.vehicles(facebook_post_id);

CREATE POLICY "Vehicles are publicly readable"
  ON public.vehicles FOR SELECT
  USING (true);

CREATE POLICY "Staff can insert vehicles"
  ON public.vehicles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update vehicles"
  ON public.vehicles FOR UPDATE
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Admin+ can delete vehicles"
  ON public.vehicles FOR DELETE
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

-- ── Leads ──────────────────────────────────────────────────────────────────
CREATE TYPE public.lead_type AS ENUM (
  'devis', 'visite', 'contact', 'financement', 'livraison', 'rappel', 'reprise'
);
CREATE TYPE public.lead_status AS ENUM ('nouveau', 'en_cours', 'traite', 'archive');

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.lead_type NOT NULL DEFAULT 'contact',
  status public.lead_status NOT NULL DEFAULT 'nouveau',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  interest TEXT,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  vehicle_slug TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can view leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Admin+ can delete leads"
  ON public.leads FOR DELETE
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

-- ── Clients ────────────────────────────────────────────────────────────────
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL DEFAULT '',
  email TEXT,
  telephone TEXT,
  adresse TEXT,
  code_postal TEXT,
  ville TEXT,
  pays TEXT NOT NULL DEFAULT 'France',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage clients"
  ON public.clients FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- ── Bank accounts (multi-RIB) ──────────────────────────────────────────────
CREATE TABLE public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  bank_name TEXT,
  iban TEXT NOT NULL,
  bic TEXT,
  instructions TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_bank_accounts_default
  ON public.bank_accounts (is_default DESC, is_active DESC);

CREATE POLICY "Staff can read bank accounts"
  ON public.bank_accounts FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Admin+ can insert bank accounts"
  ON public.bank_accounts FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admin+ can update bank accounts"
  ON public.bank_accounts FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Super admin can delete bank accounts"
  ON public.bank_accounts FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

-- ── Purchase orders (bons de commande) ─────────────────────────────────────
CREATE TYPE public.purchase_order_status AS ENUM (
  'brouillon', 'envoye', 'paye', 'annule'
);

CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  vehicle_label TEXT,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  deposit NUMERIC(12, 2) NOT NULL DEFAULT 0,
  balance NUMERIC(12, 2) GENERATED ALWAYS AS (COALESCE(amount, 0) - COALESCE(deposit, 0)) STORED,
  payment_method TEXT NOT NULL DEFAULT 'virement',
  bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
  status public.purchase_order_status NOT NULL DEFAULT 'brouillon',
  notes TEXT,
  delivery_date DATE,
  delivery_place TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage purchase orders"
  ON public.purchase_orders FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE OR REPLACE FUNCTION public.next_purchase_order_numero()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  yr TEXT := to_char(now(), 'YYYY');
  seq INT;
BEGIN
  SELECT COUNT(*) + 1 INTO seq
  FROM public.purchase_orders
  WHERE numero LIKE 'BC-' || yr || '-%';
  RETURN 'BC-' || yr || '-' || LPAD(seq::text, 4, '0');
END;
$$;

-- ── updated_at trigger ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER vehicles_set_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER clients_set_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER bank_accounts_set_updated_at
  BEFORE UPDATE ON public.bank_accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER purchase_orders_set_updated_at
  BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
