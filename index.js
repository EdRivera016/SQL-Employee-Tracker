// Load environment variables from a .env file
require("dotenv").config();

// Import external libraries
const cfonts = require("cfonts");
const inquirer = require("inquirer");

// Import database query functions from the 'queries' module
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
} = require("./db/queries");

// Display a custom styled text banner using cfonts
cfonts.say("Employee Tracker", {
  font: "block", // Specify the font style
  align: "center", // Align the text to the center
  colors: ["cyan", "red"], // Specify the colors
});

// Function to handle reassignment or deletion of employees in a department before deleting the department
const reassignOrDeleteEmployeesByDepartment = async (departmentId) => {
  // Get all employees
  const employees = await getEmployees();
  // Filter employees belonging to the specified department
  const employeesInDepartment = employees.filter(
    (emp) => emp.department_id === departmentId
  );

  // If no employees are in the department, return early
  if (employeesInDepartment.length === 0) return;

  console.log("Employees assigned to this department:");
  console.table(employeesInDepartment);

  // Prompt user for action to take with the employees in the department
  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message:
      "There are employees in this department. What would you like to do?",
    choices: [
      "Reassign employees to another department",
      "Delete employees",
      "Cancel",
    ],
  });

  // Handle the user's choice
  if (action === "Reassign employees to another department") {
    // Get all departments except the current one
    const departments = await getDepartments();
    const { newDepartmentId } = await inquirer.prompt({
      name: "newDepartmentId",
      type: "list",
      message: "Select the new department for these employees:",
      choices: departments
        .filter((dept) => dept.id !== departmentId)
        .map((dept) => ({ name: dept.name, value: dept.id })),
    });

    // Get roles in the new department
    const roles = await getRoles();
    const rolesInNewDepartment = roles.filter(
      (role) => role.department_id === newDepartmentId
    );

    // Reassign each employee to a new role in the new department
    for (const employee of employeesInDepartment) {
      const { newRoleId } = await inquirer.prompt({
        name: "newRoleId",
        type: "list",
        message: `Select the new role for ${employee.first_name} ${employee.last_name}:`,
        choices: rolesInNewDepartment.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      });

      await updateEmployeeRole(employee.id, newRoleId);
    }

    console.log("Employees reassigned.");
  } else if (action === "Delete employees") {
    // Delete each employee in the department
    for (const employee of employeesInDepartment) {
      await deleteEmployee(employee.id);
    }
    console.log("Employees deleted.");
  } else {
    // Cancel the department deletion
    throw new Error("Department deletion cancelled.");
  }
};

// Function to handle deletion of a department along with its dependencies
const deleteDepartmentWithDependencies = async (departmentId) => {
  try {
    // Reassign or delete employees in the department
    await reassignOrDeleteEmployeesByDepartment(departmentId);
    // Delete the department
    await deleteDepartment(departmentId);
    console.log("Deleted department.");
  } catch (error) {
    console.error("Error deleting department:", error.message);
  }
};

// Main function to start the application
const start = async () => {
  // Prompt user for action
  const answer = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "Add a department",
      "Delete a department",
      "View all roles",
      "Add a role",
      "Delete a role",
      "View all employees",
      "Add an employee",
      "Delete an employee",
      "Update an employee role",
      "View employees by manager",
      "Exit",
    ],
  });

  // Handle the user's choice
  switch (answer.action.trim()) {
    case "View all departments":
      const departments = await getDepartments();
      console.table(departments);
      break;

    case "View all roles":
      const roles = await getRoles();
      console.table(roles);
      break;

    case "View all employees":
      const employees = await getEmployees();
      console.table(employees);
      break;

    case "Add a department":
      const { departmentName } = await inquirer.prompt({
        name: "departmentName",
        type: "input",
        message: "Enter the name of the department:",
      });
      await addDepartment(departmentName);
      console.log(`Added department ${departmentName}`);
      break;

    case "Add a role":
      const departmentsForRole = await getDepartments();
      const { roleTitle, roleSalary, departmentId } = await inquirer.prompt([
        {
          name: "roleTitle",
          type: "input",
          message: "Enter the title of the role:",
        },
        {
          name: "roleSalary",
          type: "input",
          message: "Enter the salary of the role:",
        },
        {
          name: "departmentId",
          type: "list",
          message: "Select the department for the role:",
          choices: departmentsForRole.map((dept) => ({
            name: dept.name,
            value: dept.id,
          })),
        },
      ]);
      await addRole(roleTitle, roleSalary, departmentId);
      console.log(`Added role: ${roleTitle}`);
      break;

    case "Add an employee":
      const rolesForEmployee = await getRoles();
      const employeesForManager = await getEmployees();
      const { firstName, lastName, roleId, managerId } =
        await inquirer.prompt([
          {
            name: "firstName",
            type: "input",
            message: "Enter the first name of the employee:",
          },
          {
            name: "lastName",
            type: "input",
            message: "Enter the last name of the employee:",
          },
          {
            name: "roleId",
            type: "list",
            message: "Select the role for the employee:",
            choices: rolesForEmployee.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            name: "managerId",
            type: "list",
            message: "Select the manager for the employee:",
            choices: [{ name: "None", value: null }].concat(
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

    case "Update an employee role":
      const employeesForUpdate = await getEmployees();
      const rolesForUpdate = await getRoles();
      const { employeeId, newRoleId } = await inquirer.prompt([
        {
          name: "employeeId",
          type: "list",
          message: "Select the employee to update:",
          choices: employeesForUpdate.map((emp) => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id,
          })),
        },
        {
          name: "newRoleId",
          type: "list",
          message: "Select the new role for the employee:",
          choices: rolesForUpdate.map((role) => ({
            name: role.title,
            value: role.id,
          })),
        },
      ]);
      await updateEmployeeRole(employeeId, newRoleId);
      console.log("Updated employee role");
      break;

    case "Delete an employee":
      const employeesForDeletion = await getEmployees();
      const { employeeIdToDelete } = await inquirer.prompt([
        {
          name: "employeeIdToDelete",
          type: "list",
          message: "Select the employee to delete:",
          choices: employeesForDeletion.map((emp) => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id,
          })),
        },
      ]);
      await deleteEmployee(employeeIdToDelete);
      console.log("Deleted employee");
      break;

    case "Delete a department":
      const departmentsForDeletion = await getDepartments();
      const { departmentIdToDelete } = await inquirer.prompt([
        {
          name: "departmentIdToDelete",
          type: "list",
          message: "Select the department to delete:",
          choices: departmentsForDeletion.map((dept) => ({
            name: dept.name,
            value: dept.id,
          })),
        },
      ]);
      await deleteDepartmentWithDependencies(departmentIdToDelete);
      break;

    case "Delete a role":
      const rolesForDeletion = await getRoles();
      const { roleIdToDelete } = await inquirer.prompt([
        {
          name: "roleIdToDelete",
          type: "list",
          message: "Select the role to delete:",
          choices: rolesForDeletion.map((role) => ({
            name: role.title,
            value: role.id,
          })),
        },
        ]);
      await deleteRole(roleIdToDelete);
      console.log("Deleted role");
      break;

    case "View employees by manager":
      const employeesByManager = await getEmployeesByManager();
      console.table(employeesByManager);
      break;

    case "Exit":
      process.exit();
  }

  // Restart the application
  start();
};

// Start the application
start();
