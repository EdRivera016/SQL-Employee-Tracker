-- Drop the database 'Employee_Trackerdb' if it exists
DROP DATABASE IF EXISTS Employee_Trackerdb;
-- Create a new database named 'Employee_Trackerdb'
CREATE DATABASE Employee_Trackerdb;

-- Connect to the newly created 'Employee_Trackerdb' database
\c Employee_Trackerdb;

-- Create the 'department' table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,  -- Auto-incrementing primary key for the department
    name VARCHAR(30) NOT NULL UNIQUE -- Name of the department, must be unique and not null
);

-- Create the 'role' table
CREATE TABLE role (
    id SERIAL PRIMARY KEY,    -- Auto-incrementing primary key for the role
    title VARCHAR(30) NOT NULL,   -- Title of the role, cannot be null
    salary DECIMAL NOT NULL,     -- Salary for the role, cannot be null
    department_id INTEGER NOT NULL, -- Foreign key to reference the 'department' table
    FOREIGN KEY (department_id) REFERENCES department(id) -- Define the foreign key constraint
);

-- Create the 'employee' table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,         -- Auto-incrementing primary key for the employee
    first_name VARCHAR(30) NOT NULL, -- First name of the employee, cannot be null
    last_name VARCHAR(30) NOT NULL,  -- Last name of the employee, cannot be null
    role_id INTEGER NOT NULL,      -- Foreign key to reference the 'role' table
    manager_id INTEGER,            -- Foreign key to reference another employee as a manager (can be null)
    FOREIGN KEY (role_id) REFERENCES role(id), -- Define the foreign key constraint for role
    FOREIGN KEY (manager_id) REFERENCES employee(id) -- Define the foreign key constraint for manager
);