-- PUBLISHERS
INSERT INTO publishers(name, address, phone) VALUES
('Pearson','London, UK','+44-111-222'),
('OReilly','CA, USA','+1-333-444'),
('Oxford Press','Oxford, UK','+44-555-666');

-- AUTHORS 
INSERT INTO authors(full_name) VALUES
('Thomas H. Cormen'),
('Andrew S. Tanenbaum'),
('George Orwell'),
('Yuval Noah Harari'),
('Jared Diamond'),
('Tim Marshall'),
('Karen Armstrong'),
('Huston Smith'),
('E. H. Gombrich'),
('John Berger'),
('Peter Frankopan');

-- CATEGORIES
INSERT INTO categories(name) VALUES
('Science'),
('Art'),
('Religion'),
('History'),
('Geography');

-- USERS
INSERT INTO users(
  username,
  password_hash,
  first_name,
  last_name,
  email,
  phone,
  shipping_address,
  role
) VALUES
('admin',
 '$2b$12$9eTQpRsDNtvUDJloN2jwPe07lAJ4b0JkHm.9CejSEjUu9v/ZV3j3i',
 'Admin','One','admin@site.com','0100000000','Alexandria','ADMIN'),
('sara',
 '$2b$12$4gj94AuX1oGcJKh52Un25uYTzn.snCGrbwe9sZ.EuyJ8MiikdBMG6',
 'Sara','Ali','sara@site.com','0111111111','Cairo','CUSTOMER');

-- BOOKS
INSERT INTO books(
  isbn,
  title,
  publication_year,
  selling_price,
  category_id,
  publisher_id,
  stock_qty,
  threshold
) VALUES
('9780061660184','The World''s Religions',1958,500.00,3,3,6,3),
('9780099590088','Sapiens',2014,600.00,4,3,12,6),
('9780131429383','Operating Systems Design',2006,900.00,1,1,8,10),
('9780140135152','Ways of Seeing',1972,380.00,2,1,10,5),
('9780143036555','A History of God',1993,450.00,3,3,27,3),
('9780241358794','The Power of Geography',2021,520.00,5,1,8,4),
('9780262033848','Introduction to Algorithms',2009,1500.00,1,1,30,10),
('9780393317558','Guns, Germs, and Steel',1997,550.00,4,1,10,5),
('9780451524935','1984',1949,250.00,2,2,50,5),
('9780714832470','The Story of Art',1950,700.00,2,3,8,4),
('9781101912379','The Silk Roads',2015,620.00,4,3,7,4),
('9781783962433','Prisoners of Geography',2015,480.00,5,1,22,4);

-- BOOK_AUTHORS
INSERT INTO book_authors(isbn, author_id) VALUES
('9780061660184',8),
('9780099590088',4),
('9780131429383',2),
('9780140135152',10),
('9780143036555',7),
('9780241358794',6),
('9780262033848',1),
('9780393317558',5),
('9780451524935',3),
('9780714832470',9),
('9781101912379',11),
('9781783962433',6);

-- CART (test data)
INSERT INTO carts(user_id,status)
VALUES (2,'ACTIVE');

INSERT INTO cart_items(cart_id, isbn, qty)
VALUES (1,'9780451524935',2);
