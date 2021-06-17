const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');
const { start } = require("repl");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '5141',
    database: 'employeesDB'
});

connection.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected");
    console.log('\x1b[36m%s\x1b[0m', `
    
888'Y88                      888                                           e   e                                                     
888 ,'Y 888 888 8e  888 88e  888  e88 88e  Y8b Y888P  ,e e,   ,e e,       d8b d8b     ,"Y88b 888 8e   ,"Y88b  e88 888  ,e e,  888,8, 
888C8   888 888 88b 888 888b 888 d888 888b  Y8b Y8P  d88 88b d88 88b     e Y8b Y8b   "8" 888 888 88b "8" 888 d888 888 d88 88b 888 "  
888 ",d 888 888 888 888 888P 888 Y888 888P   Y8b Y   888   , 888   ,    d8b Y8b Y8b  ,ee 888 888 888 ,ee 888 Y888 888 888   , 888    
888,d88 888 888 888 888 88"  888  "88 88"     888     "YeeP"  "YeeP"   d888b Y8b Y8b "88 888 888 888 "88 888  "88 888  "YeeP" 888    
                    888                       888                                                              ,  88P                
                    888                       888                                                             "8",P"                 
`);
    startApp();
});

function startApp() {

    inquirer
        .prompt({
            type: "list",
            name: "task",
            message: "Would you like to do?",
            choices: [

                "View all Employees",
                "View all Departments",
                "View all Roles",
                "Add a Department",
                "Add a Employee",
                "Update a Employee Role",
                "Add a Role",
                "View Employees by Manager",
                "View Employees by Department",
                "Delete Employee",
                "Delete Department",
                "Delete Role"
            ]
        })
        .then(function ({ task }) {
            switch (task) {
                case "View all Employees":
                    viewAllEmployees();
                    break;

                case "View all Departments":
                    viewAllDepartments();
                    break;

                case "View all Roles":
                    viewAllRoles();
                    break;

                case "Add a Department":
                    addDepartment();
                    break;

                case "Add a Employee":
                    addEmployee();
                    break;

                case "Update a Employee Role":
                    updateEmpRole();
                    break;

                case "Add a Role":
                    addRole();
                    break;

                case "View Employees by Manager":
                    viewEmpByManager();
                    break;

                case "View Employees by Department":
                    viewEmpByDepo();
                    break;

                case "Delete Employee":
                    deleteEmp();
                    break;

                case "Delete Department":
                    deleteDepo();
                    break;

                case "Delete Role":
                    deleteRole();
                    break;
            }
        });
}

function viewAllEmployees() {

    var query =
        `SELECT e.id, e.first_name, e.last_name, r.title AS "role", d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r
	ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
	ON m.id = e.manager_id`;

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        startApp();
    });
}

function viewAllDepartments() {
    var query = `SELECT id, name AS "department" FROM department`

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        startApp();
    });
}

function viewAllRoles() {
    var query = `SELECT r.id, r.title AS "role", d.name AS "department", r.salary
    FROM role r
    LEFT JOIN department d
    ON d.id = r.department_id`;

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        startApp();
    });
}

function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "department",
            message: "Please enter a new department name:"
        })
        .then((answer) => {
            var query = `INSERT INTO department (name)
            VALUES ("${answer.department}")`;

            connection.query(query, function (err, res) {
                if (err) throw err;

                console.log("Successfully added a new department!");
                startApp();
            });
        });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "firstname",
                message: "Please enter the employee's first name:"
            },
            {
                type: "input",
                name: "lastname",
                message: "Please enter the employee's last name:"
            },
            {
                type: "number",
                name: "role",
                message: "Please enter the employee's role id:"
            },
            {
                type: "number",
                name: "manager",
                message: "Please enter the employee's manager id:"
            }
        ])
        .then((answer) => {
            var query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ("${answer.firstname}", "${answer.lastname}", ${answer.role}, ${answer.manager})`;

            connection.query(query, function (err, res) {
                if (err) throw err;

                console.log("Successfully added a new employee!");
                startApp();
            });
        });
}

function updateEmpRole() {

    inquirer
        .prompt([
            {
                type: "number",
                name: "empId",
                message: "Please enter the employee's id:"
            },
            {
                type: "number",
                name: "roleId",
                message: "Please enter the new role id:"
            }
        ])
        .then((answer) => {
            var query = `UPDATE employee
            SET role_id = ${answer.roleId}
            WHERE id = ${answer.empId}`;

            connection.query(query, function (err, res) {
                if (err) throw err;

                console.log("Successfully updated the employee's role!");
                startApp();
            });
        });
}

function viewEmpByManager() {
    inquirer
        .prompt([
            {
                type: "number",
                name: "manId",
                message: "Please enter the manager's id:"
            }
        ])
        .then((answer) => {
            var query = `SELECT e.id, e.first_name, e.last_name, r.title AS "role", d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN role r
              ON e.role_id = r.id
            LEFT JOIN department d
            ON d.id = r.department_id
            LEFT JOIN employee m
              ON m.id = e.manager_id
            WHERE e.manager_id = ${answer.manId}`;

            connection.query(query, function (err, res) {
                if (err) throw err;

                console.table(res);
                startApp();
            });
        });
}

function viewEmpByDepo() {
    inquirer
        .prompt([
            {
                type: "number",
                name: "depoId",
                message: "Please enter the department's id:"
            }
        ])
        .then((answer) => {
            var query = `SELECT e.id, e.first_name, e.last_name, r.title AS "role", d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN role r
              ON e.role_id = r.id
            LEFT JOIN department d
            ON d.id = r.department_id
            LEFT JOIN employee m
              ON m.id = e.manager_id
            WHERE r.department_id = ${answer.depoId}`;

            connection.query(query, function (err, res) {
                if (err) throw err;

                console.table(res);
                startApp();
            });
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "title",
                message: "Please enter the role's title:"
            },
            {
                type: "number",
                name: "salary",
                message: "Please enter the salary for the role:"
            },
            {
                type: "number",
                name: "depoId",
                message: "Please enter the role's department id:"
            }
        ])
        .then((answer) => {
            var query = `INSERT INTO role (title, salary, department_id)
            VALUES ("${answer.title}", ${answer.salary}, ${answer.depoId})`;

            connection.query(query, function (err, res) {
                if (err) throw err;

                console.log("Successfully added a new role!");
                startApp();
            });
        });
}

function deleteEmp() {
    inquirer
        .prompt([
            {
                type: "number",
                name: "empId",
                message: "Please enter the employee's id for deletion:"
            }
        ])
        .then((answer) => {
            var query = `DELETE FROM employee WHERE id = ${answer.empId}`;

            connection.query(query, function (err, res) {
                if (err) throw err;

                console.log("Employee was deleted!")
                startApp();
            });
        });
}

function deleteDepo() {
    inquirer
        .prompt([
            {
                type: "number",
                name: "depoId",
                message: "Please enter the department's id for deletion:"
            }
        ])
        .then((answer) => {
            var query = `DELETE FROM department WHERE id = ${answer.depoId}`;

            connection.query(query, function (err, res) {
                if (err) throw err;

                console.log("Department was deleted!")
                startApp();
            });
        });
}

function deleteRole() {
    inquirer
        .prompt([
            {
                type: "number",
                name: "roleId",
                message: "Please enter the role's id for deletion:"
            }
        ])
        .then((answer) => {
            var query = `DELETE FROM role WHERE id = ${answer.roleId}`;

            connection.query(query, function (err, res) {
                if (err) throw err;

                console.log("Role was deleted!")
                startApp();
            });
        });
}