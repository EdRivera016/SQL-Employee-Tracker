-- department

-- id: SERIAL PRIMARY KEY

-- name: VARCHAR(30) UNIQUE NOT NULL to hold department name

-- role

-- id: SERIAL PRIMARY KEY

-- title: VARCHAR(30) UNIQUE NOT NULL to hold role title

-- salary: DECIMAL NOT NULL to hold role salary

-- department_id: INTEGER NOT NULL to hold reference to department role belongs to

-- employee

-- id: SERIAL PRIMARY KEY

-- first_name: VARCHAR(30) NOT NULL to hold employee first name

-- last_name: VARCHAR(30) NOT NULL to hold employee last name

-- role_id: INTEGER NOT NULL to hold reference to employee role

-- manager_id: INTEGER 

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NOT,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER, 
    FOREIGN KEY (role_id) REFERENCES ROLE(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);