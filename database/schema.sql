-- ORDER PROCESSING SYSTEM (PostgreSQL)

CREATE TYPE user_role AS ENUM ('ADMIN', 'CUSTOMER');
CREATE TYPE order_status AS ENUM ('Pending', 'Confirmed', 'Cancelled');

-- USERS
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  phone VARCHAR(30),
  shipping_address TEXT,
  role user_role NOT NULL DEFAULT 'CUSTOMER',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- PUBLISHERS
CREATE TABLE publishers (
  publisher_id SERIAL PRIMARY KEY,
  name VARCHAR(120) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(30) NOT NULL
);

-- AUTHORS
CREATE TABLE authors (
  author_id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) UNIQUE NOT NULL
);

-- CATEGORIES
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(60) UNIQUE NOT NULL
);

-- BOOKS
CREATE TABLE books (
  isbn VARCHAR(20) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  publication_year INT CHECK (publication_year BETWEEN 1500 AND 2100),
  selling_price NUMERIC(10,2) NOT NULL CHECK (selling_price >= 0),

  category_id INT NOT NULL REFERENCES categories(category_id),

  publisher_id INT NOT NULL REFERENCES publishers(publisher_id),
  stock_qty INT NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  threshold INT NOT NULL DEFAULT 0 CHECK (threshold >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE book_authors (
  isbn VARCHAR(20) REFERENCES books(isbn) ON DELETE CASCADE,
  author_id INT REFERENCES authors(author_id) ON DELETE CASCADE,
  PRIMARY KEY (isbn, author_id)
);

-- CARTS
CREATE TABLE carts (
  cart_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_items (
  cart_id INT REFERENCES carts(cart_id) ON DELETE CASCADE,
  isbn VARCHAR(20) REFERENCES books(isbn),
  qty INT NOT NULL CHECK (qty > 0),
  PRIMARY KEY (cart_id, isbn)
);

-- CUSTOMER ORDERS
CREATE TABLE customer_orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id),
  order_date TIMESTAMP NOT NULL DEFAULT NOW(),
  total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_last4 VARCHAR(4),
  status order_status NOT NULL DEFAULT 'Pending'
);

CREATE TABLE customer_order_items (
  order_id INT REFERENCES customer_orders(order_id) ON DELETE CASCADE,
  isbn VARCHAR(20) REFERENCES books(isbn),
  book_name_snapshot VARCHAR(200) NOT NULL,
  unit_price_snapshot NUMERIC(10,2) NOT NULL,
  qty INT NOT NULL CHECK (qty > 0),
  PRIMARY KEY(order_id, isbn)
);

-- SALES (for reports)
CREATE TABLE sales_transactions (
  sale_id SERIAL PRIMARY KEY,
  order_id INT UNIQUE REFERENCES customer_orders(order_id) ON DELETE CASCADE,
  sale_date TIMESTAMP NOT NULL DEFAULT NOW(),
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0)
);

-- REPLENISHMENT ORDERS (From Publishers)
CREATE TABLE replenishment_orders (
  repl_order_id SERIAL PRIMARY KEY,
  isbn VARCHAR(20) NOT NULL REFERENCES books(isbn),
  publisher_id INT NOT NULL REFERENCES publishers(publisher_id),
  order_date TIMESTAMP NOT NULL DEFAULT NOW(),
  qty INT NOT NULL CHECK (qty > 0),
  status order_status NOT NULL DEFAULT 'Pending'
);

-- TRIGGER 1: Prevent negative stock (before update)
CREATE OR REPLACE FUNCTION prevent_negative_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock_qty < 0 THEN
    RAISE EXCEPTION 'Stock cannot be negative for ISBN %', NEW.isbn;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_negative_stock
BEFORE UPDATE OF stock_qty ON books
FOR EACH ROW
EXECUTE FUNCTION prevent_negative_stock();

-- TRIGGER 2: Auto place replenishment order when crossing threshold (after update)
-- Condition: OLD.stock_qty > threshold AND NEW.stock_qty < threshold
-- Fixed qty: 20
CREATE OR REPLACE FUNCTION auto_replenish_when_below_threshold()
RETURNS TRIGGER AS $$
DECLARE
  fixed_qty INT := 20;
BEGIN
  IF (OLD.stock_qty > OLD.threshold) AND (NEW.stock_qty < NEW.threshold) THEN
    INSERT INTO replenishment_orders(isbn, publisher_id, qty, status)
    VALUES (NEW.isbn, NEW.publisher_id, fixed_qty, 'Pending');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_replenish
AFTER UPDATE OF stock_qty ON books
FOR EACH ROW
EXECUTE FUNCTION auto_replenish_when_below_threshold();

-- TRIGGER 3: When replenishment order confirmed, add qty to stock
CREATE OR REPLACE FUNCTION add_stock_on_replenishment_confirm()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status <> 'Confirmed' AND NEW.status = 'Confirmed' THEN
    UPDATE books
    SET stock_qty = stock_qty + NEW.qty
    WHERE isbn = NEW.isbn;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_repl_confirm_add_stock
AFTER UPDATE OF status ON replenishment_orders
FOR EACH ROW
EXECUTE FUNCTION add_stock_on_replenishment_confirm();
