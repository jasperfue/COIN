const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

router.get('/:name', async (req, res) => {
    const { name } = req.params;
    const { date } = req.query;

    try {
        const client = await pool.connect();
        const result = await client.query(
            'SELECT * FROM sleep_data WHERE user_name = $1 AND date = $2',
            [name, date]
        );
        client.release();

        if (result.rows.length === 0) {
            res.status(404).send({ message: 'Keine Daten für diesen Benutzer gefunden.' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.error('Fehler beim Abrufen der Daten', err);
        res.status(500).send('Serverfehler beim Abrufen der Daten');
    }
});

router.post('/:name', async (req, res) => {
    const { name } = req.params;
    const { date, sleep_cycle_score, feeling } = req.body;

    try {
        const client = await pool.connect();
        const result = await client.query(
            `INSERT INTO sleep_data (user_name, date, sleep_cycle_score, feeling)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [name, date, sleep_cycle_score, feeling]
        );
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Fehler beim Erstellen der Daten', err);
        res.status(500).send('Serverfehler beim Erstellen der Daten');
    }
});

router.put('/:name', async (req, res) => {
    const { name } = req.params;
    const { date, sleep_cycle_score, feeling } = req.body;

    try {
        const client = await pool.connect();
        const result = await client.query(
            `UPDATE sleep_data
       SET sleep_cycle_score = $3, feeling = $4
       WHERE user_name = $1 AND date = $2
       RETURNING *`,
            [name, date, sleep_cycle_score, feeling]
        );
        client.release();

        if (result.rows.length === 0) {
            res.status(404).send({ message: 'Daten nicht gefunden.' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.error('Fehler beim Aktualisieren der Daten', err);
        res.status(500).send('Serverfehler beim Aktualisieren der Daten');
    }
});

module.exports = router;
