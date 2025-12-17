-- Demo data (enough to test every feature)

-- Publishers
INSERT INTO publishers(name, address, phone) VALUES
('Pearson','London, UK','+44-111-222'),
('OReilly','CA, USA','+1-333-444'),
('Oxford Press','Oxford, UK','+44-555-666');

-- Authors
INSERT INTO authors(full_name) VALUES
('Thomas H. Cormen'),
('Andrew S. Tanenbaum'),
('George Orwell'),
('Yuval Noah Harari');

-- Users
INSERT INTO users(username,password_hash,first_name,last_name,email,phone,shipping_address,role)
VALUES
('admin','$2b$12$9eTQpRsDNtvUDJloN2jwPe07lAJ4b0JkHm.9CejSEjUu9v/ZV3j3i','Admin','One','admin@site.com','0100000000','Alexandria','ADMIN'),
('sara','$2b$12$4gj94AuX1oGcJKh52Un25uYTzn.snCGrbwe9sZ.EuyJ8MiikdBMG6','Sara','Ali','sara@site.com','0111111111','Cairo','CUSTOMER');

-- Books
INSERT INTO books(isbn,title,publication_year,selling_price,category,publisher_id,stock_qty,threshold)
VALUES
('9780262033848','Introduction to Algorithms',2009,1500,'Science',1,30,10),
('9780131429383','Operating Systems Design',2006,900,'Science',1,8,10),
('9780451524935','1984',1949,250,'Art',2,50,5),
('9780099590088','Sapiens',2014,600,'History',3,12,6);

-- Book-Authors
INSERT INTO book_authors(isbn, author_id) VALUES
('9780262033848',1),
('9780131429383',2),
('9780451524935',3),
('9780099590088',4);

-- Create one active cart for Sara
INSERT INTO carts(user_id,status) VALUES (2,'ACTIVE');

-- Put 1 book in cart to test checkout quickly
INSERT INTO cart_items(cart_id, isbn, qty) VALUES (1,'9780451524935',2);
