-- Structured request details + installment schedule on purchase orders

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS details JSONB;

COMMENT ON COLUMN public.leads.details IS
  'Payload typé: visite (date/créneau), livraison (adresse), financement (nb échéances)';

ALTER TABLE public.purchase_orders
  ADD COLUMN IF NOT EXISTS installment_count integer
    CHECK (installment_count IS NULL OR installment_count IN (1, 2, 3, 4));

ALTER TABLE public.purchase_orders
  ADD COLUMN IF NOT EXISTS installment_schedule JSONB;

COMMENT ON COLUMN public.purchase_orders.installment_schedule IS
  '[{ label, amount, due_label }] pour paiement en 2/3/4 fois';
