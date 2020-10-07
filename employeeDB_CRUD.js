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
});

// Query to view all employees
const viewEmployees = () => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name, CONCAT(em.first_name, " ", em.last_name) AS "manager"
        FROM employee e
        LEFT JOIN employee em ON em.id = e.manager_id
        INNER JOIN role r ON e.role_id = r.id
        INNER JOIN department d ON r.department_id = d.id`, (err, res) => {
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

// Query that returns list of roles
const getRoles = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM role;", (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

// Query that returns list of employees
const getEmployees = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS "EmployeeName" FROM employee;', (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
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
const addEmployee = (newEmployee) => {
    // destructuring newEmployee object
    const { firstName, lastName, role, manager } = newEmployee;
    return new Promise((resolve, reject) => {
        if(manager === "None") {
            connection.query(`INSERT INTO employee (first_name, last_name, role_id)
            SELECT ?, ?, role.id
            FROM role
            WHERE role.title = ?;`, [firstName, lastName, role], (err, res) => {
                if (err) reject(err);
                console.log("\x1b[34m", "Employee added successfully!");
                resolve();
            });
        } else {
            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
            SELECT ?, ?, role.id, employee.id
            FROM role, employee
            WHERE role.title = ? AND CONCAT(first_name, " ", last_name) = ?;`, [firstName, lastName, role, manager], (err, res) => {
                if (err) reject(err);
                console.log("\x1b[34m", "Employee added successfully!");
                resolve();
            });
        }
    });
}

// Query to remove an employee from the employee table
const removeEmployee = (employee) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM employee WHERE CONCAT(first_name, " ", last_name) = ?;', employee, (err, res) => {
            if (err) reject(err);
            console.log("\x1b[34m", "Employee deleted successfully!");
            resolve();
        });
    });
}

// Query to update an employee's role
const updateEmployeeRole = (employee) => {
    const { employeeName, role } = employee;
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE employee
        SET role_id = (SELECT id FROM role WHERE title = ?)
        WHERE CONCAT(first_name, " ", last_name) = ?;`, [role, employeeName], (err, res) => {
            if (err) reject(err);
            console.log("\x1b[34m", "Employee successfully updated!");
            resolve();
        });
    });
}

// Query to update an employee's manager
const updateEmployeeManager = (manager, employee) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE employee 
        SET manager_id = (SELECT id FROM (SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = ?) AS x)
        WHERE CONCAT(first_name, " ", last_name) = ?;`, [manager, employee], (err, res) => {
            if (err) reject(err);
            console.log("\x1b[34m", "Employee's manager successfully updated!");
            resolve();
        });
    });
}

// Query to view all departments
const viewAllDepartments = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM department", (err, res) => {
            if (err) reject(err);
            console.table(res);
            resolve();
        });
    }); 
}

// Query to add a department to the departments table
const addDepartment = (department) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO department (name) VALUE (?)", department, (err, res) => {
            if (err) reject(err);
            console.log("\x1b[34m", "Department successfully added!");
            resolve();
        });
    })
}

module.exports = {
    viewEmployees,
    viewEmployeesByDepartment,
    viewEmployeesByManager,
    addEmployee,
    removeEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    getDepartments,
    getManagers,
    getRoles,
    getEmployees,
    viewAllDepartments,
    addDepartment
}