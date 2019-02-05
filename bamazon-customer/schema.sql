DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT AUTO_INCREMENT NOT NULL,
  prod_name VARCHAR(45) NOT NULL,
  dept_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  inventory_quantity INT(5) NOT NULL,
  primary key(item_id)
);

SELECT * FROM products;

INSERT INTO products (prod_name, dept_name, price, inventory_quantity)
VALUES ('Parodontax', 'Health Supplies', 4.57, 100),
  ('Remote', 'Electronics', 14.99, 12),
  ('Cell phone', 'Electronics', 999.99, 4),
  ('Lamp', 'Electronics', 35.49, 2),
  ('Chair', 'Furniture', 9.99, 18)
  