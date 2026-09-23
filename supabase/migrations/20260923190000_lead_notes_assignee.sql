-- Lead CRM fields: internal notes + assignee
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

COMMENT ON COLUMN public.leads.notes IS 'Notes internes staff (non visibles client)';
COMMENT ON COLUMN public.leads.assigned_to IS 'Conseiller assigné (auth.users)';
