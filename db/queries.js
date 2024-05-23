const pool + require('./pool');

const getDepartment = async () => {
    const res = await pool.query('SELECT * FROM department');
    return res.rows;
};

const getRoles = async () => {
    const res = await pool.query(`SELECT role.*, frpartment.name AS department
    FROM role 
    JOIN department ON role,department_id = department.id`)
}