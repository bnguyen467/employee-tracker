const inquirer = require('inquirer');
const db = require('./db');
require('console.table');

function init ()
{
    inquirer
        .prompt({
            type: 'list',
            name: 'toDo',
            message: 'What do you want to do?',
            choices: ['View All Employees',
                'View Employees By Manager',
                'Add A New Eployee',
                'Remove An Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Departments',
                'Add A New Department',
                'Remove A Department',
                'View ALL Roles',
                'Add A New Roles',
                'Remove A Role',
                'View Total Salary On A Department',
                'Exit']
        })

        .then(function ({ toDo }) 
        {
            switch(toDo)
            {
                case 'View All Employees':
                    viewEmployee();
                    break;
                case 'View Employees By Manager':
                    viewByManager();
                    break;
                case 'Add A New Eployee':
                    addEmployee();
                    break;
                case 'Remove An Employee':
                    removeEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'Update Employee Manager':
                    updateEmployeeManager();
                    break;
                case 'View All Departments':
                    viewDepartment();
                    break;
                case 'Add A New Department':
                    addDepartment();
                    break;
                case 'Remove A Department':
                    removeDepartment();
                    break;
                case 'View ALL Roles':
                    viewRoles();
                    break;
                case 'Add A New Roles':
                    addRoles();
                    break;
                case 'Remove A Role':
                    removeRoles();
                    break;
                case 'View Total Salary On A Department':
                    totalSalary();
                    break;
                case 'Exit':
                    exit();
                    break;
            }
        })
        .catch (function (error) { console.log(error) })
}

function viewEmployee()
{
    db.query(`SELECT employee.id, employee.first_name, employee.last_name,
            roles.title, roles.salary, department.name AS department, 
            CONCAT(manager.first_name, " ", manager.last_name) AS manager
            FROM employee
            LEFT JOIN roles
            ON employee.role_id = roles.id
            LEFT JOIN department
            ON roles.department_id = department.id
            LEFT JOIN employee manager
            ON manager.id = employee.manager_id`,
            function (error, data)
            {
                if (error) { console.log(error) }

                // Show data on table
                console.table(data);

                // Back to init function
                init();
            })
}


function viewByManager()
{
    db.query('SELECT * FROM employee', function (error, employee){
        if (error) { console.log(error) }

        employee = employee.map(emp => ({ 
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }))

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'select',
                    message: 'Select a manager: ',
                    choices: employee
                }
            ])
            .then(answer =>  {
                db.query(`SELECT employee.id, employee.first_name, employee.last_name, 
                        roles.title,
                        CONCAT(manager.first_name, " ", manager.last_name) AS manager
                        FROM employee
                        LEFT JOIN roles
                        ON employee.role_id = roles.id
                        LEFT JOIN employee manager
                        ON manager.id = employee.manager_id
                        WHERE employee.manager_id = ?`,
                        answer.select, function(error, data)
                        {
                            if (error) { console.log(error) }

                            console.table(data);
                            init();
                        })
            })
    })
}

function addEmployee()
{
    db.query('SELECT * FROM roles', function (error, roles){
        if (error) { console.log(error) }

        roles = roles.map(role => ({ name: role.title, value: role.id }))
    
        db.query('SELECT * FROM employee', function (error, employee){
            if (error) { console.log(error) }

            employee = employee.map(emp => ({ 
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id
            }))

            employee.unshift( { name: 'None', value: null} )

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: `New employee's first name: `
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: `New employee's last name: `
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: `New employee's role: `,
                        choices: roles
                    },
                    {
                        type: 'list',
                        name: 'manager_id',
                        message: `New employee's manager: `,
                        choices: employee
                    },
                ])
                .then(data => {
                    db.query('INSERT INTO employee SET ?', data, (error) => {
                        if (error) { console.log(error) }

                        console.log('New Employee Added!');
                        init();
                    })
                })
                .catch (function (error) { console.log(error) })
        })
    })
}

function removeEmployee()
{
    db.query('SELECT * FROM employee', function (error, employee){
        if (error) { console.log(error) }

        employee = employee.map(emp => ({ 
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }))

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'name',
                    message: 'Select employee to remove: ',
                    choices: employee
                }
            ])
            .then(data => {
                db.query('DELETE FROM employee WHERE id = ?', data.name, (error) => {
                    if (error) { console.log(error) }

                    console.log('Employee Removed!');
                    init();
                })
            })
            .catch (function (error) { console.log(error) })
    })
}

function updateEmployeeRole()
{
    db.query('SELECT * FROM roles', function (error, roles){
        if (error) { console.log(error) }

        roles = roles.map(role => ({ name: role.title, value: role.id }))
    
        db.query('SELECT * FROM employee', function (error, employee){
            if (error) { console.log(error) }

            employee = employee.map(emp => ({ 
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id
            }))

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Select employee to change role: ',
                        choices: employee
                    },
                    {
                        type: 'list',
                        name: 'newRole',
                        message: `New role for employee: `,
                        choices: roles
                    }
                ])
                .then(data => {
                    db.query('UPDATE employee SET role_id = ? WHERE id = ?', [data.newRole, data.employee], (error) => {
                        if (error) { console.log(error) }

                        console.log(`Employee role changed!`);
                        init();
                    })
                })
                .catch (function (error) { console.log(error) })
        })
    })
}

function updateEmployeeManager()
{
    db.query('SELECT * FROM employee', function (error, employee){
        if (error) { console.log(error) }

        employee = employee.map(emp => ({ 
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }))

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select employee: ',
                    choices: employee
                },
                {
                    type: 'list',
                    name: 'newManager',
                    message: `New manager for the employee: `,
                    choices: employee
                },
            ])
            .then(data => {
                db.query('UPDATE employee SET manager_id = ? WHERE id = ?', [data.newManager, data.employee], (error) => {
                    if (error) { console.log(error) }
                    
                    console.log(`Employee's manager changed!`);
                    init();
                })
            })
            .catch (function (error) { console.log(error) })
    })
}

function viewDepartment()
{
    db.query(`SELECT department.id, department.name AS department
            FROM department ORDER BY id`, 
        function (error, data){
            if (error) { console.log(error) }

        console.table(data);
        init();
    })
}

function addDepartment()
{
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter new department: '
            }
        ])
        .then(data => {
            db.query('INSERT INTO department SET ?', data, (error) => {
                if (error) { console.log(error) }

                console.log('New Department Added!');
                init();
            })
        })
        .catch (function (error) { console.log(error) })
}

function removeDepartment()
{
    db.query('SELECT * FROM department', function (error, department){
        if (error) { console.log(error) }

        department = department.map(dpt => ({ 
            name: `${dpt.name}`,
            value: dpt.id
        }))

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'rvDpt',
                    message: 'Select department to remove: ',
                    choices: department
                }
            ])
            .then(data => {
                db.query('DELETE FROM department WHERE id = ?', data.rvDpt, (error) => {
                    if (error) { console.log(error) }

                    console.log('Department Removed!');
                    init();
                })
            })
            .catch (function (error) { console.log(error) })
    })
}

function viewRoles()
{
    db.query(`SELECT roles.id, roles.title, roles.salary,
            department.name AS department
            FROM roles
            LEFT JOIN department
            ON roles.department_id = department.id`, 
        function (error, data){
            if (error) { console.log(error) }

        console.table(data);
        init();
    })
}

function addRoles()
{
    db.query('SELECT * FROM department', function (error, department){
        if (error) { console.log(error) }

        department = department.map(dpt => ({ 
            name: `${dpt.name}`,
            value: dpt.id
        }))
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter new role title: '
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter salary for new role: '
                },
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'Select department for new role: ',
                    choices: department
                }
            ])
            .then(data => {
                db.query('INSERT INTO roles SET ?', data, (error) => {
                    if (error) { console.log(error) }

                    console.log('New Role Added!');
                    init();
                })
            })
            .catch (function (error) { console.log(error) })
        })
}

function removeRoles()
{
    db.query('SELECT * FROM roles', function (error, roles){
        if (error) { console.log(error) }

        roles = roles.map(role => ({ 
            name: `${role.title}`,
            value: role.id
        }))

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'rvRole',
                    message: 'Select role to remove: ',
                    choices: roles
                }
            ])
            .then(data => {
                db.query('DELETE FROM roles WHERE id = ?', data.rvRole, (error) => {
                    if (error) { console.log(error) }

                    console.log('Role Removed!');
                    init();
                })
            })
            .catch (function (error) { console.log(error) })
    })
}

function totalSalary()
{
    db.query('SELECT * FROM department', function(error, department){
        if (error) { console.log(error) }

        department = department.map(dpt => ({ 
            name: `${dpt.name}`,
            value: dpt.id
        }))

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'select',
                    message: 'Select a department:',
                    choices: department
                }
            ])
            .then(answer => {
                db.query(`SELECT department.id, department.name AS department,
                        SUM(roles.salary) AS total_budget
                        FROM employee
                        LEFT JOIN roles
                        ON employee.role_id = roles.id
                        LEFT JOIN department
                        ON roles.department_id = department.id
                        WHERE department.id = ?`,
                    answer.select, function (error, data){
                        if (error) { console.log(error) }

                        console.table(data);
                        init();
                    }) 
            })
            .catch (function (error) { console.log(error) })
    })
}

function exit()
{
    console.log('Goodbye! Have a good day!');
    db.end();
}

init();
