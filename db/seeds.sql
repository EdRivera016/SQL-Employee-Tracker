-- Inserting departments into the 'department' table
INSERT INTO department (name)
VALUES
('Research and Development'),
('Marketing'),
('Human Resources'),
('Operations');

-- Inserting roles into the 'role' table with corresponding department IDs
INSERT INTO role (title, salary, department_id)
VALUES
('Data Scientist', 95000, 1),
('Marketing', 80000, 2),
('HR Specialist', 110000, 3),
('Operations Director', 180000, 4);

-- Inserting employees into the 'employee' table with corresponding role IDs and manager IDs
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Smith', 1, 4),
('Elena', 'Lopez', 2, 3),
('Gabriel', 'Martinez', 3, 1),
('Mateo', 'Hernandez', 4, NULL);