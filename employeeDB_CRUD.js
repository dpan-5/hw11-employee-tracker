const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "digdog49",
    database: "employee_DB"
});

connection.connect(err => {
    if(err) throw err;
    console.log("connected as id " + connection.threadId);
})

const viewEmployees = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        console.table(res);
        connection.end();
    })
}

module.exports = {
    viewEmployees
}