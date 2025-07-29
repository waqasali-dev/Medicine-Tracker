import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import pg from 'pg';
import env from "dotenv";


const app = express();
const PORT = 3000;
env.config();
// Set EJS as the view engine
app.set('view engine', 'ejs');

const { Client } = pg;

const pool = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the database', err.stack);
    } else {
        console.log('Connected to the database');
    }
});


pool.query('SELECT * FROM medicine', (err, res) => {
    if (err) {
        console.error('Error executing query', err.stack);
    } else {
        console.log('Query results:', res.rows);
    }
});


// Set the views directory using a generalized path
app.set('views', path.join(process.cwd(), 'views'));
app.use(express.static(path.join(process.cwd(), 'public')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {

    const alter = false;
    res.render('index.ejs', {
        alternatives: alter
    });

});

app.post('/find-alternatives', (req, res) => {

    const { formula, medicineName } = req.body;
    console.log('Formula:', formula);
    console.log('Medicine Name:', medicineName);

    if (!formula && !medicineName) {

        return res.status(400).send('Formula and Medicine Name are required');

    } else if (formula === '' && medicineName) {
        pool.query(
            'SELECT m.medicinename, m.formula, m.manufacturer, d.dosage, d.price, d.agestart, d.ageend ' +
            'FROM medicine m ' +
            'JOIN dose d ON m.medicineName = d.medicinename ' +
            'WHERE m.medicineName = $1',
            [medicineName],
            (err, result) => {
                if (err) {
                    console.error('Error executing query', err.stack);
                    return res.status(500).send('Database error');
                }
                console.log('Query results:', result.rows);
                res.render('index.ejs', {
                    alternatives: result.rows,
                });
            }
        );
    } else if (medicineName === '' && formula) {
        pool.query(
            'SELECT m.medicinename, m.formula, m.manufacturer, d.dosage, d.price, d.agestart, d.ageend ' +
            'FROM medicine m ' +
            'JOIN dose d ON m.medicineName = d.medicinename ' +
            'WHERE m.formula = $1',
            [formula],
            (err, result) => {
                if (err) {
                    console.error('Error executing query', err.stack);
                    return res.status(500).send('Database error');
                }
                console.log('Query results:', result.rows);
                res.render('index.ejs', {
                    alternatives: result.rows,
                });
            }
        );
    } else if (medicineName && formula) {
        pool.query(
            'SELECT m.medicinename, m.formula, m.manufacturer, d.dosage, d.price, d.agestart, d.ageend ' +
            'FROM medicine m ' +
            'JOIN dose d ON m.medicineName = d.medicinename ' +
            'WHERE m.formula = $1 OR m.medicineName = $2',
            [formula, medicineName],
            (err, result) => {
                if (err) {
                    console.error('Error executing query', err.stack);
                    return res.status(500).send('Database error');
                }
                console.log('Query results:', result.rows);
                res.render('index.ejs', {
                    alternatives: result.rows,
                });
            }
        );
    }

});

app.get('/admin', (req, res) => {

    res.render('admin.ejs', {});

});

app.get('/admin-delete', async (req, res) => {

    res.render('admin-delete.ejs', {});

});

app.get('/admin-update', async (req, res) => {

    res.render('admin-update.ejs', { medicine: false });

});

app.post('/admin/add-medicine', async (req, res) => {

    console.log('Received data:', req.body);
    const { medicineName, formula, manufacturer, dose, startAge, endAge, price } = req.body;

    // Insert into medicine table
    await pool.query(
        'INSERT INTO medicine (medicineName, formula, manufacturer) VALUES ($1, $2, $3) ON CONFLICT (medicineName) DO NOTHING',
        [medicineName, formula, manufacturer]
    );

    // Insert each dose
    function ensureArray(val) {
        return Array.isArray(val) ? val : [val];
    }

    const doses = ensureArray(dose);
    const startAges = ensureArray(startAge);
    const endAges = ensureArray(endAge);
    const prices = ensureArray(price);

    for (let i = 0; i < doses.length; i++) {
        await pool.query(
            'INSERT INTO dose (medicineName, dosage, agestart, ageend, price) VALUES ($1, $2, $3, $4, $5) ON CONFLICT ON CONSTRAINT unique_dose DO NOTHING',
            [medicineName, doses[i], startAges[i], endAges[i], prices[i]]
        );
    }

    res.redirect('/admin');


});

app.post('/admin/delete-medicine', async (req, res) => {
    const medicineName = req.body.deleteMedicineName;

    console.log('Deleting medicine:', req.body);

    // Delete from dose table
    await pool.query(
        'DELETE FROM dose WHERE medicineName = $1',
        [medicineName]
    );

    // Delete from medicine table
    await pool.query(
        'DELETE FROM medicine WHERE medicineName = $1',
        [medicineName]
    );

    res.redirect('/admin-delete');

});

app.post('/admin/fetch-medicine', async (req, res) => {

    const medicineToFetchData = req.body.updateMedicineName;
    if (medicineToFetchData) {
        // Fetch existing data for the medicine
        const result = await pool.query(
            'SELECT m.medicineName, m.formula, m.manufacturer, d.dosage, d.agestart, d.ageend, d.price ' +
            'FROM medicine m ' +
            'JOIN dose d ON m.medicineName = d.medicinename ' +
            'WHERE m.medicineName = $1',
            [medicineToFetchData]
        );

        if (result.rows.length > 0) {
            console.log('Fetched medicine data:', result.rows);
            return res.render('admin-update.ejs', { medicine: result.rows });
        } else {
            return res.status(404).send('Medicine not found');
        }
    }

});

app.post('/admin/update-medicine', async (req, res) => {

    const { medicineName, formula, manufacturer, dose, startAge, endAge, price } = req.body;
    console.log('Updating medicine:', req.body);
    // Update medicine table
    await pool.query(
        'UPDATE medicine SET formula = $1, manufacturer = $2 WHERE medicineName = $3',
        [formula, manufacturer, medicineName]
    );
    // Update dose table
    function ensureArray(val) {
        return Array.isArray(val) ? val : [val];
    }
    await pool.query(
        'DELETE FROM dose WHERE medicineName = $1',
        [medicineName]
    );
    const doses = ensureArray(dose);
    const startAges = ensureArray(startAge);
    const endAges = ensureArray(endAge);
    const prices = ensureArray(price);
    for (let i = 0; i < doses.length; i++) {
        await pool.query(
            'INSERT INTO dose (medicineName, dosage, agestart, ageend, price) VALUES ($1, $2, $3, $4, $5) ON CONFLICT ON CONSTRAINT unique_dose DO UPDATE SET dosage = EXCLUDED.dosage, agestart = EXCLUDED.agestart, ageend = EXCLUDED.ageend, price = EXCLUDED.price',
            [medicineName, doses[i], startAges[i], endAges[i], prices[i]]
        );
    }

    res.redirect('/admin-update');
    
});


app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);

});