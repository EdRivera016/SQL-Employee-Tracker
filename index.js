
require('dotenv').config();
const inquirer = require('inquirer');
const {
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
} = require('./db/queries');

const start = async () => {
  const answer = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
        'View all departments',
        'Add a department',
        'Delete a department',
        'View all roles',
        'Add a role',
        'Delete a role',
        'View all employees',
        'Add an employee',
        'Delete an employee',
        'Update an employee role',
        'View employees by manager',
        'Exit',
    ],
  });

  switch (answer.action) {
    case 'View all departments':
      const departments = await getDepartments();
      console.table(departments);
      break;

    case 'View all roles':
      const roles = await getRoles();
      console.table(roles);
      break;

    case 'View all employees':
      const employees = await getEmployees();
      console.table(employees);
      break;

    case 'Add a department':
      const { departmentName } = await inquirer.prompt({
        name: 'departmentName',
        type: 'input',
        message: 'Enter the name of the department:',
      });
      await addDepartment(departmentName);
      console.log(`Added department ${departmentName}`);
      break;

    case 'Add a role':
      const departmentsForRole = await getDepartments();
      const { roleTitle, roleSalary, departmentId } = await inquirer.prompt([
        {
          name: 'roleTitle',
          type: 'input',
          message: 'Enter the title of the role:',
        },
        {
          name: 'roleSalary',
          type: 'input',
          message: 'Enter the salary of the role:',
        },
        {
          name: 'departmentId',
          type: 'list',
          message: 'Select the department for the role:',
          choices: departmentsForRole.map((dept) => ({ name: dept.name, value: dept.id })),
        },
      ]);
      await addRole(roleTitle, roleSalary, departmentId);
      console.log(`Added role: ${roleTitle}`);
      break;

    case 'Add an employee':
      const rolesForEmployee = await getRoles();
      const employeesForManager = await getEmployees();
      const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
          name: 'firstName',
          type: 'input',
          message: 'Enter the first name of the employee:',
        },
        {
          name: 'lastName',
          type: 'input',
          message: 'Enter the last name of the employee:',
        },
        {
          name: 'roleId',
          type: 'list',
          message: 'Select the role for the employee:',
          choices: rolesForEmployee.map((role) => ({ name: role.title, value: role.id })),
        },
        {
          name: 'managerId',
          type: 'list',
          message: 'Select the manager for the employee:',
          choices: [{ name: 'None', value: null }].concat(
            employeesForManager.map((emp) => ({
              name: `${emp.first_name} ${emp.last_name}`,
              value: emp.id,
            }))
          ),
        },
      ]);
      await addEmployee(firstName, lastName, roleId, managerId);
      console.log(`Added employee: ${firstName} ${lastName}`);
      break;

    case 'Update an employee role':
      const employeesForUpdate = await getEmployees();
      const rolesForUpdate = await getRoles();
      const { employeeId, newRoleId } = await inquirer.prompt([
        {
          name: 'employeeId',
          type: 'list',
          message: 'Select the employee to update:',
          choices: employeesForUpdate.map((emp) => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id,
          })),
        },
        {
          name: 'newRoleId',
          type: 'list',
          message: 'Select the new role for the employee:',
          choices: rolesForUpdate.map((role) => ({ name: role.title, value: role.id })),
        },
      ]);
      await updateEmployeeRole(employeeId, newRoleId);
      console.log('Updated employee role.');
      break;

      const updatedEmployees = await getEmployees();
      console.table(updatedEmployees);
      break;

case 'Delete an Employee':
    const employeesForDelete = await getEmployees();
    const { employeeToDeleteId } = await inquirer.prompt([
        {
            name: 'employeeToDeleteId',
            type: 'list',
            message: 'Select the employee to delete:',
            choices: employeesForDelete.map((emp) => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id,
            })),
        },
    ]);
    await deleteEmployee(employeeToDeleteId);
    console.log('Deleted employee.');

    const remainingEmployees = await getEmployees();
    console.table(remainingEmployees);
    break;

    case 'Delete a department':
        const departmentsForDelete = await getDepartments();
        const { departmentToDeleteId } = await inquirer.prompt([
            {
                name: ' departmentToDeleteId',
                type: 'list',
                message: 'Select the department to delete:',
                choices: departmentsForDelete.map((dept) => ({
                    name: dept.name,
                    value: dept.id,
                })),
            },
        ]);
        await deleteDepartment(departmentToDeleteId);
        console.log('Deleted department.');

        const updatedDepartments = await getDepartments();
        console.table(updatedDepartments);
        break;

    case 'View Employees by manager':
    const employessByManager = await getEmployeesByManager();
    console.table(employeesByManager);
    break;


    case 'Exit':
      process.exit();
      break;

    default:
      break;
  }

  start();
};

start();
