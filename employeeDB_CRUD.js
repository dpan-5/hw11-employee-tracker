const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "digdog49",
    database: "employee_DB"
});

connection.connect(err => {
    if(err) throw err;
})

// Query to view all employees
const viewEmployees = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM employee", (err, res) => {
            if (err) reject(err);
            console.table(res);
            resolve();
        });
    });
}

// Query to view all employees by department
const viewEmployeesByDepartment = (department) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT e.id, e.first_name, e.role_id, e.manager_id, d.name
        FROM employee e LEFT JOIN department d 
        ON e.role_id = d.id
        WHERE d.name = ?;`, [department], (err, res) => {
            if (err) reject(err);
            console.table(res);
            resolve();
        });
    });
}

// Query that returns list of departments
const getDepartments = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM department", (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}



module.exports = {
    viewEmployees,
    viewEmployeesByDepartment,
    getDepartments
}