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
