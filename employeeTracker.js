const inquirer = require("inquirer");
const employeeDB_CRUD = require("./employeeDB_CRUD");

const choices = [
    "View All Employees",
    "View All Employees By Department",
    "View All Employees By Manager",
    "Add Employee",
    "Remove Employee",
    "Update Employee Role",
    "Update Employee Manager"
];

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
                break;
            case "Add Employee":
                break;
            case "Remove Employee":
                break;
            case "Update Employee Role":
                break;
            case "Update Employee Manager":
                break;
            default:
                console.log("Please select something!");
        }
        init();
    });
}


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
        ]).then( ({ department }) => {
            employeeDB_CRUD.viewEmployeesByDepartment(department);
        });
    });
}

init();