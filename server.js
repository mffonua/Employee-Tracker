const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
let roles;
let departments;
let managers;
let employees;


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password123',
    database: 'employee_tracker'
    },
    console.log('Connected to employee_tracker database.')
);
db.connect((err) => {
    if (err) throw err;
    initialQuestions();
    currentRoles();
    currentDepartments();
    currentManagers();
    currentEmployees();
})
initialQuestions = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: [
                'View All Employees', 
                'Add Employee',
                'Update Employee Role',
                'View All Roles', 
                'Add Role', 
                'View All Departments', 
                'Add Department', 
                'Quit',
            ]
        }
    ]).then((res) => {
        // Directs user to next function which provides next steps/questions to move forward 
        switch (res.choice) {
            case 'View All Employees': viewEmployees();
                break;
            case 'Add Employee': addEmployee();
                break;
            case 'Update Employee Role': updateEmployeeRole();
                break;
            case 'View All Roles': viewRoles();
                break;
            case 'Add Role': addRole();
                break;
            case 'View All Departments': viewDepartments();
                break;
            case 'Add Department': addDepartment();
                break;
            case 'Quit': db.end();
                break;
            default: db.end();
                break;
        }
    })
};