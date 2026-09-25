-- Bucket public pour les photos véhicules (photo principale + futures galeries)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle-photos',
  'vehicle-photos',
  true,
  8388608, -- 8 Mo
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Lecture publique (affichage site)
CREATE POLICY "Public read vehicle photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'vehicle-photos');

-- Upload / remplacement réservé au staff authentifié
CREATE POLICY "Staff upload vehicle photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'vehicle-photos'
    AND public.is_staff(auth.uid())
  );

CREATE POLICY "Staff update vehicle photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'vehicle-photos'
    AND public.is_staff(auth.uid())
  )
  WITH CHECK (
    bucket_id = 'vehicle-photos'
    AND public.is_staff(auth.uid())
  );

CREATE POLICY "Staff delete vehicle photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'vehicle-photos'
    AND public.is_staff(auth.uid())
  );
