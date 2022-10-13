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
currentRoles = () => {
    db.query("SELECT id, title FROM role", (err, result) => {
        if (err) throw err;
        roles = result;
    })
}
currentDepartments = () => {
    db.query("SELECT id, name FROM department", (err, result) => {
        if (err) throw err;
        departments = result;
    })
}
currentManagers = () => {
    db.query("SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee", (err, result) => {
        if (err) throw err;
        managers = result;
    })
}
currentEmployees = () => {
    db.query("SELECT id, CONCAT_WS(' ', first_name, last_name) AS employee_name FROM employee", (err, result) => {
        if (err) throw err;
        employees = result;
    })

}
function addEmployee(){
    currentRoles();
    currentManagers();

    let roleOptions = [];
    for (i = 0; i < roles.length; i++) {
        roleOptions.push(Object(roles[i]));
    }

    let managerOptions = [];
    for (i = 0; i < managers.length; i++) {
        managerOptions.push(Object(managers[i]));
    }

    // prompts for adding an employee
    inquirer
        .prompt([
            { 
                type: "input",
                message: "What is the employee's first name?",
                name: 'first_name',
            },
            { 
                type: "input",
                message: "What is the employee's last name?",
                name: 'last_name',
            },
            { 
                type: "list",
                message: "What is the employee's role?",
                name: 'role_id',
                choices: function() {
                    let choiceArray = [];
                    for (let i = 0; i < roleOptions.length; i++) {
                        choiceArray.push(roleOptions[i].title)
                    }
                    return choiceArray;
                }
            },
            { 
                type: "list",
                message: "Who is the employee's manager",
                name: 'manager_id',
                choices: function() {
                    let choiceArray = [];
                    for (let i = 0; i < managerOptions.length; i++) {
                        choiceArray.push(managerOptions[i].managers)
                    }
                    return choiceArray;
                }
            }
        ])
        .then((res) => {
            for (i = 0; i < roleOptions.length; i++) {
                if (roleOptions[i].title === res.role_id) {
                    role_id = roleOptions[i].id
                }
            }

            for (i = 0; i < managerOptions.length; i++) {
                if (managerOptions[i].managers === res.manager_id) {
                    manager_id = managerOptions[i].id
                }
            }

            // adding data properly to the table
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${res.first_name}", "${res.last_name}", ${role_id}, ${manager_id})`, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('New employee added: ' + res.first_name + ' ' + res.last_name);
                    currentEmployees();
                    initialQuestions();
                }
            });
    });
};