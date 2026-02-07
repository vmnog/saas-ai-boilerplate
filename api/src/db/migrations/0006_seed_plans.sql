-- Update free product metadata to include all required fields
UPDATE products
SET metadata = '{"sendMessageLimit": 10, "benefits": "10 mensagens por dia", "shouldHighlight": false, "off": 0}'::jsonb
WHERE id = 'prod_free';

--> statement-breakpoint

-- Insert Basic plan product
INSERT INTO products (id, stripe_product_id, active, name, description, metadata)
VALUES (
  'prod_basic',
  'prod_basic',
  true,
  'Plano Basic',
  'Ideal para uso diário',
  '{"sendMessageLimit": 100, "benefits": "100 mensagens por dia|Histórico completo de conversas|Suporte por email", "shouldHighlight": false, "off": 0}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

--> statement-breakpoint

-- Insert Basic plan price
INSERT INTO prices (id, stripe_price_id, stripe_product_id, active, currency, type, unit_amount, interval, interval_count, trial_period_days)
VALUES (
  'price_basic',
  'price_basic',
  'prod_basic',
  true,
  'brl',
  'recurring',
  2990,
  'month',
  1,
  7
)
ON CONFLICT (id) DO NOTHING;

--> statement-breakpoint

-- Insert Premium plan product
INSERT INTO products (id, stripe_product_id, active, name, description, metadata)
VALUES (
  'prod_premium',
  'prod_premium',
  true,
  'Plano Premium',
  'Para quem precisa do máximo',
  '{"sendMessageLimit": 1000, "benefits": "1000 mensagens por dia|Histórico completo de conversas|Suporte prioritário|Acesso antecipado a novos recursos", "shouldHighlight": true, "off": 10}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

--> statement-breakpoint

-- Insert Premium plan price
INSERT INTO prices (id, stripe_price_id, stripe_product_id, active, currency, type, unit_amount, interval, interval_count, trial_period_days)
VALUES (
  'price_premium',
  'price_premium',
  'prod_premium',
  true,
  'brl',
  'recurring',
  4990,
  'month',
  1,
  7
)
ON CONFLICT (id) DO NOTHING;
