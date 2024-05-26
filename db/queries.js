const pool = require('./pool');

// Get all departments
const getDepartments = async () => {
  const res = await pool.query('SELECT * FROM department');
  return res.rows;
};

// Get all roles
const getRoles = async () => {
  const res = await pool.query(`
    SELECT role.*, department.name AS department
    FROM role 
    JOIN department ON role.department_id = department.id`);
  return res.rows;
};

// Get all employees
const getEmployees = async () => {
  const res = await pool.query(`SELECT employee.*, role.title, role.salary, department.name AS department, 
    manager.first_name AS manager_first_name, manager.last_name AS manager_last_name 
    FROM employee 
    JOIN role ON employee
    .role_id = role.id 
    JOIN department ON role.department_id = department.id 
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id`);
  return res.rows;
};

// Add a new department
const addDepartment = async (name) => {
  const res = await pool.query('INSERT INTO department (name) VALUES ($1) RETURNING *', [name]);
  return res.rows[0];
};

// Add a new role
const addRole = async (title, salary, department_id) => {
  const res = await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *', [title, salary, department_id]);
  return res.rows[0];
};

// Add a new employee
const addEmployee = async (first_name, last_name, role_id, manager_id) => {
  const res = await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [first_name, last_name, role_id, manager_id]);
  return res.rows[0];
};

// Update an employee's role
const updateEmployeeRole = async (employee_id, role_id) => {
  const res = await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *', [role_id, employee_id]);
  return res.rows[0];
};

// Delete an employee
const deleteEmployee = async (employee_id) => {
  await pool.query('DELETE FROM employee WHERE id = $1', [employee_id]);
};

// Delete a department with dependency check
const deleteDepartment = async (departmentId) => {
  try {
    await pool.query('DELETE FROM employee USING role WHERE employee.role_id = role.id AND role.department_id = $1', [departmentId]);
    await pool.query('DELETE FROM role WHERE department_id = $1', [departmentId]);
    await pool.query('DELETE FROM department WHERE id = $1', [departmentId]);
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};

// Delete a role with dependency check
const deleteRole = async (role_id) => {
  try {
    // Check for employees with this role
    const employeesWithRole = await pool.query('SELECT id FROM employee WHERE role_id = $1', [role_id]);
    if (employeesWithRole.rows.length > 0) {
      throw new Error('There are employees assigned to this role. Please reassign or delete those employees first.');
    }

    // Delete the role
    await pool.query('DELETE FROM role WHERE id = $1', [role_id]);
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

// Get employees by manager
const getEmployeesByManager = async () => {
  const res = await pool.query(`
    SELECT manager.first_name AS manager_first_name, manager.last_name AS manager_last_name,
        employee.first_name, employee.last_name, role.title AS role, department.name AS department
        FROM employee
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        ORDER BY manager.last_name, manager.first_name, employee.last_name, employee.first_name
    `);
  return res.rows;
};

module.exports = {
    getDepartments,
    getRoles,
    getEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    deleteEmployee,
    deleteDepartment,
    deleteRole,
    getEmployeesByManager,
};