ALTER TABLE payments
ADD COLUMN payment_reference VARCHAR(200) NULL AFTER transaction_id;