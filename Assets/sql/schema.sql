-- Please Execute each one in order

-- 1
USE employee_db;
INSERT INTO department(name)
VALUE ('Sales'), 
    ('Engineering'), 
    ('Finance'), 
    ('Legal');

-- 2
USE employee_db;
INSERT INTO roles(title, salary, department_id)
VALUE ('Sales Lead', 100000, 1),
	('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Accoutant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

-- 3
USE employee_db;
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUE ('John', 'Doe', 1, NULL),
	('Mike', 'Chan', 2, NULL),
	('Ashley', 'Rodriguez', 3, NULL),
	('Kevin', 'Tupik', 4, NULL),
	('Malia', 'Brown', 5, NULL),
	('Sarah', 'Lourd', 6, NULL),
	('Tom', 'Allen', 7, NULL);

-- 4
USE employee_db;
UPDATE employee SET manager_id = 10 WHERE first_name = 'John';
UPDATE employee SET manager_id = 8 WHERE first_name = 'Mike';
UPDATE employee SET manager_id = 10 WHERE first_name = 'Kevin';
UPDATE employee SET manager_id = 13 WHERE first_name = 'Tom';