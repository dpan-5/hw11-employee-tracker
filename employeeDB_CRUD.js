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
        connection.query("SELECT * FROM department;", (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

// Query that returns list of managers
const getManagers = () => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT CONCAT(b.first_name, " ", b.last_name) AS Name 
        FROM employee a LEFT JOIN employee b
        ON a.manager_id = b.id
        WHERE a.manager_id IS NOT NULL
        GROUP BY a.manager_id;`, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const getRoles = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM role;", (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

// Query to view all employees by manager
const viewEmployeesByManager = (manager) => {
   return new Promise((resolve, reject) => {
       connection.query(`SELECT CONCAT(a.first_name," " , a.last_name) AS 'Employee Name', a.role_id, CONCAT(b.first_name, " ", b.last_name) AS 'Manager Name'
       FROM employee a LEFT JOIN employee b
       ON a.manager_id = b.id
       WHERE CONCAT(b.first_name, " ", b.last_name) = ?;`, [manager], (err, res) => {
           if (err) reject(err);
           console.table(res);
           resolve();
       });
   }); 
}

// Query to add an employee to the employee table
const addEmployee = (employeeObject) => {
    return new Promise((resolve, reject) => {
        console.log(employeeObject);
        resolve();
    });
}

module.exports = {
    viewEmployees,
    viewEmployeesByDepartment,
    viewEmployeesByManager,
    addEmployee,
    getDepartments,
    getManagers,
    getRoles
}