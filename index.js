const inquirer = require('inquirer');
const {
    getDepartments,
    getRoles,
    getEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
} = require('./db/queries');


const start = async () => {
    const answer = await inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Updatea an employee role',
            'Exit',
        ],
    });

    switch (answer.action) {
        case 'View all departments':
        const departments = await getDepartments();
        console.table(departments);
        break;
    
        case "View all roles":
        const roles = await getRoles();
        console.table(roles);
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
                const
    }
}