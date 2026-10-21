CREATE TABLE IF NOT EXISTS readings (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT,
  birth_date TEXT,
  birth_time TEXT,
  sun_sign TEXT,
  moon_sign TEXT,
  rising_sign TEXT,
  deck_id TEXT,
  deck_name TEXT,
  card TEXT,
  transit_planet TEXT,
  spread_size INTEGER,
  spread_cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  spread_positions JSONB NOT NULL DEFAULT '[]'::jsonb,
  prior_reading_count INTEGER NOT NULL DEFAULT 0,
  cosmic_date TEXT,
  cosmic_impact TEXT,
  reading_text TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS readings_created_at_idx
  ON readings (created_at DESC);
