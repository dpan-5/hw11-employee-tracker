const inquirer = require("inquirer");
const employeeDB_CRUD = require("./employeeDB_CRUD");

const choices = [
    "View All Employees",
    "View All Employees By Department",
    "View All Employees By Manager",
    "Add Employee",
    "Remove Employee",
    "Update Employee Role",
    "Update Employee Manager",
    "View All Departments",
    "Add Department",
    "View All Roles",
    "Add Role"
];

// ASCII ART
console.log("\x1b[34m",
    `
|----------------------------------------------------------------------------|                                                             
|     _____           _                    _____                             |
|    |   __|_____ ___| |___ _ _ ___ ___   |     |___ ___ ___ ___ ___ ___     |
|    |   __|     | . | | . | | | -_| -_|  | | | | .'|   | .'| . | -_|  _|    |
|    |_____|_|_|_|  _|_|___|_  |___|___|  |_|_|_|__,|_|_|__,|_  |___|_|      |
|                |_|       |___|                            |___|            |
|                                                                            |
|----------------------------------------------------------------------------|
   `
);

const init = () => {
    inquirer.prompt([
        {
            name: "userSelection",
            type: "list",
            message: "What would you like to do?",
            choices: choices
        }
    ]).then(async ({ userSelection }) => {
        switch(userSelection) {
            case "View All Employees":
                await employeeDB_CRUD.viewEmployees();
                break;
            case "View All Employees By Department":
                await viewEmployeesByDepartment();
                break;
            case "View All Employees By Manager":
                await viewEmployeesByManager();
                break;
            case "Add Employee":
                await addEmployee();
                break;
            case "Remove Employee":
                await removeEmployee();
                break;
            case "Update Employee Role":
                await updateEmployeeRole()
                break;
            case "Update Employee Manager":
                await updateEmployeeManager();
                break;
            case "View All Departments":
                await employeeDB_CRUD.viewAllDepartments();
                break;
            case "Add Department":
                await addDepartment();
                break;    
            case "View All Roles":
                await employeeDB_CRUD.viewAllRoles();
                break; 
            case "Add Role":
                await addRole();
                break;     
            default:
                console.log("Please select something!");
        }
        init();
    });
}

// Grabs a list of current departments and populates choices for user to select
const viewEmployeesByDepartment = async () => {
    const choices = await employeeDB_CRUD.getDepartments();
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                name: "department",
                type: "list",
                message: "Please select a department: ",
                choices: choices
            }
        ]).then(async ({ department }) => {
            await employeeDB_CRUD.viewEmployeesByDepartment(department);
            resolve();
        });
    });
}

// Grabs a list of current managers and populates choices for user to select
const viewEmployeesByManager = async () => {
    const choices = await employeeDB_CRUD.getManagers();
    const newChoices = choices.map(manager => manager.Name);
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                name: "manager",
                type: "list",
                message: "Please select a manager: ",
                choices: newChoices
            }
        ]).then(async ({ manager }) => {
            await employeeDB_CRUD.viewEmployeesByManager(manager);
            resolve();
        });
    });
}

const addEmployee = async () => {
    let roleChoices = await employeeDB_CRUD.getRoles();
    roleChoices = roleChoices.map(role => role.title);
    let managerChoices = await employeeDB_CRUD.getManagers();
    managerChoices = managerChoices.map(manager => manager.Name);
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name: "role",
                type: "list",
                message: "What is the employee's role?",
                choices: roleChoices
            },
            {
                name: "manager",
                type: "list",
                message: "Who is the employee's manager?",
                choices: [...managerChoices, "None"]
            },
        ]).then(async res => {
            await employeeDB_CRUD.addEmployee(res);
            resolve();
        });
    });
}

const removeEmployee = async () => {
    // Grab list of employees from DB to display as choices to user
    let employeeChoices = await employeeDB_CRUD.getEmployees();
    employeeChoices = employeeChoices.map(employee => employee.EmployeeName);
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                name: "employee",
                type: "list",
                message: "Which employee would you like to remove?",
                choices: employeeChoices
            }
        ]).then(async ({ employee }) => {
            await employeeDB_CRUD.removeEmployee(employee);
            resolve();
        });
    });
}

const updateEmployeeRole = async () => {
    // Returns array of employees from employee table
    let employeeChoices = await employeeDB_CRUD.getEmployees();
    employeeChoices = employeeChoices.map(employee => employee.EmployeeName);

    // Returns array of roles from role table
    let roleChoices = await employeeDB_CRUD.getRoles();
    roleChoices = roleChoices.map(role => role.title);

    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                name: "employeeName",
                type: "list",
                message: "Which employee would you like to update the role of?",
                choices: employeeChoices
            },
            {
                name: "role",
                type: "list",
                message: "What role do you want to assign to this employee?",
                choices: roleChoices
            }
        ]).then(async res => {
            await employeeDB_CRUD.updateEmployeeRole(res);
            resolve();
        });
    });
}

const updateEmployeeManager = async () => {
    let employeeToUpdate;
    let employeeChoices = await employeeDB_CRUD.getEmployees();
    employeeChoices = employeeChoices.map(employee => employee.EmployeeName);

    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                name: "employeeName",
                type: "list",
                message: "Which employee would you like to update the role of?",
                choices: employeeChoices
            },
        ]).then(({ employeeName }) => {
            employeeToUpdate = employeeName;
            inquirer.prompt([
                {
                    name: "managerName",
                    type: "list",
                    message: "Which person do you want to assign to this employee as manager?",
                    choices: () => employeeChoices.filter(employee => employee !== employeeName)
                }
            ]).then(async ({ managerName }) => {
                console.log(managerName, employeeToUpdate);
                await employeeDB_CRUD.updateEmployeeManager(managerName, employeeToUpdate);
                resolve();
            });
        });
    });
}

const addDepartment = async () => {
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                name: "department",
                type: "input",
                message: "What department would you like to add?",
            },
        ]).then(async ({ department }) => {
            await employeeDB_CRUD.addDepartment(department);
            resolve();
        });
    });
}

const addRole = async () => {
    let departmentChoices = await employeeDB_CRUD.getDepartments();
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title of the role you'd like to add?"
            },
            {
                name: "salary",
                type: "number",
                message: "What is the salary of this role?"
            },
            {
                name: "department",
                type: "list",
                message: "What department does this role belong to?",
                choices: departmentChoices
            },
        ]).then(async res => {
            await employeeDB_CRUD.addRole(res);
            resolve();
        });
    });
}

init();
