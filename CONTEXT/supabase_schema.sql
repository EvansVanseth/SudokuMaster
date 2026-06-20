-- 1. Crear tabla de perfiles (extensión de auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Crear tabla de partidas
CREATE TABLE public.games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  board JSONB NOT NULL, -- Almacena el estado actual del tablero
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  time_spent INTEGER DEFAULT 0, -- Tiempo en segundos
  is_winner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- 4. Políticas para perfiles
CREATE POLICY "Los usuarios pueden ver su propio perfil" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 5. Políticas para partidas
CREATE POLICY "Los usuarios pueden ver sus propias partidas" 
ON public.games FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propias partidas" 
ON public.games FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias partidas" 
ON public.games FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias partidas" 
ON public.games FOR DELETE 
USING (auth.uid() = user_id);

-- 6. Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Crear tabla de feedback
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  app_version TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Seguridad a nivel de fila)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Política: Solo usuarios autenticados pueden insertar sus propias sugerencias
CREATE POLICY "Authenticated users can insert feedback" ON public.feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Opcional: Para que vos puedas verlas (admin)
CREATE POLICY "Admin can read all feedback" ON public.feedback
  FOR SELECT USING (auth.role() = 'service_role');

-- Crear vista para obtener los 10 mejores jugadores
CREATE OR REPLACE VIEW top_players_view AS
SELECT
  g.user_id,
  p.full_name AS display_name,
  SUM(
    CASE
      WHEN g.difficulty = 'easy' THEN 1
      WHEN g.difficulty = 'medium' THEN 3
      WHEN g.difficulty = 'hard' THEN 5
      ELSE 0
    END
  ) AS total_score
FROM public.games g
JOIN public.profiles p ON g.user_id = p.id
WHERE g.status = 'completed'
GROUP BY g.user_id, p.full_name
ORDER BY total_score DESC
LIMIT 10;

-- 1. Asegurarnos de que cualquier usuario autenticado pueda leer perfiles
CREATE POLICY "Los perfiles públicos pueden ser vistos por cualquier usuario autenticado" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

-- 1. Eliminar la política anterior de la vista (si la creamos)
DROP VIEW IF EXISTS public.top_players_view;

-- 2. Crear la vista con SECURITY DEFINER (esto le permite ignorar el RLS de las tablas internas)
CREATE OR REPLACE VIEW public.top_players_view 
WITH (security_invoker = false) AS -- <-- SECURITY DEFINER implícito al no ser invoker
SELECT
  g.user_id,
  COALESCE(p.full_name, 'Jugador Anónimo') AS display_name,
  SUM(
    CASE
      WHEN g.difficulty = 'easy' THEN 1
      WHEN g.difficulty = 'medium' THEN 3
      WHEN g.difficulty = 'hard' THEN 5
      ELSE 0
    END
  )::integer AS total_score
FROM public.games g
JOIN public.profiles p ON g.user_id = p.id
WHERE g.status = 'completed'
GROUP BY g.user_id, p.full_name
ORDER BY total_score DESC
LIMIT 10;

-- 3. IMPORTANTE: Garantizar que el usuario autenticado pueda consultar esta vista
GRANT SELECT ON public.top_players_view TO authenticated;