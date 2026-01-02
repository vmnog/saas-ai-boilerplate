--> statement-breakpoint
INSERT INTO products (id, stripe_product_id, active, name, description, metadata)
VALUES (
  'prod_free',
  'prod_free',
  true,
  'Plano Grátis',
  'Plano Grátis',
  '{"sendMessageLimit": 10, "benefits": "10 mensagens por dia"}'::jsonb
);
--> statement-breakpoint
INSERT INTO prices (id, stripe_price_id, stripe_product_id, active, currency, type, unit_amount, interval, interval_count, trial_period_days)
VALUES (
  'price_free',
  'price_free',
  'prod_free',
  true,
  'brl',
  'recurring',
  0,
  'month',
  1,
  0
);
