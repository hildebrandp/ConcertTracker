import path from 'path';
import { Request, Response } from 'express';

import { getConnection } from '../config/db';
import JSONSchemaValidator from '../utils/JSONSchemaValidator';


const table_name_ConcertBands = "ConcertBands";
const table_name_EventBands = "EventBands";
const schema_ConcertBand_FilePath = path.resolve(__dirname, "../types/schemas/ConcertBand.json");

const validator = new JSONSchemaValidator();

export const get_AllConcertBands = async (req: Request, res: Response) => {
    let connection;
    try {
        connection = await getConnection();
        const rows = await connection.query(`SELECT * FROM ${table_name_ConcertBands}`);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching Concert-Bands:', error);
        res.status(500).send('Error fetching Concert-Bands');
    } finally {
        if (connection) connection.end();
    }
};

export const get_ConcertBand_ById = async (req: Request, res: Response) => {
    const { id } = req.params; // Get the 'id' parameter from the request
    let connection;

    if (isNaN(Number(id))) {
        res.status(400).send({ message: 'Invalid ID format' });
        return;
    }

    try {
        connection = await getConnection();
        const query = `SELECT * FROM ${table_name_ConcertBands} WHERE id = ?`;
        const rows = await connection.query(query, [id]); // Use parameterized query to prevent SQL injection

        if (rows.length === 0) {
            res.status(404).send({ message: 'Concert-Band not found' });
        }

        res.json(rows[0]); // Send the first result
    } catch (error) {
        console.error('Error fetching Concert-Bands:', error);
        res.status(500).send('Error fetching Concert-Bands');
    } finally {
        if (connection) connection.end();
    }
};

export const create_ConcertBand = async (req: Request, res: Response) => {
    const bandData = req.body;

    // Validate the incoming request body
    const isValid = validator.validateObject(bandData, schema_ConcertBand_FilePath);

    if (!isValid) {
        res.status(400).json({ message: 'Invalid data. See server logs for details.' });
        return;
    }

    const { name,
        genre = null,
        origin_country = null,
        rating = null,
        notes = null,
        link = null,
        website = null
    } = bandData;

    let connection;

    try {
        connection = await getConnection();

        // Insert the new venue into the database
        const query = `INSERT INTO ${table_name_ConcertBands} (name, genre, origin_country, rating, notes, link, website) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const result = await connection.query(query, [name, genre, origin_country, rating, notes, link, website]);

        // Check if the insert was successful
        if (result.affectedRows === 1) {
            console.log(`Concert-Band created successfully`);
            res.status(201).json({
                message: 'Concert-Band created successfully',
                bandId: result.insertId.toString(), // Return the ID of the newly created record
            });
        } else {
            console.log(`Error: Failed to create Concert-Band`);
            res.status(400).json({ message: 'Failed to create Concert-Band in database' });
        }
    } catch (error) {
        console.error('Error creating Concert-Band:', error);
        res.status(500).json({ message: 'Error creating Concert-Band' });
    } finally {
        if (connection) connection.end();
    }
};

export const update_ConcertBand_ById = async (req: Request, res: Response) => {
    const { id } = req.params; // Get the ID from the URL
    const bandData = req.body;

    // Validate the incoming request body
    const isValid = validator.validateObject(bandData, schema_ConcertBand_FilePath);

    if (!isValid) {
        res.status(400).json({ message: 'Invalid data. See server logs for details.' });
        return;
    }

    let connection;

    try {
        connection = await getConnection();

        // Check if the concert venue exists
        const [existingVenue] = await connection.query(
            `SELECT * FROM ${table_name_ConcertBands} WHERE id = ?`,
            [id]
        );

        if (!existingVenue) {
            res.status(404).json({ message: `Concert-Band with ID [ ${id} ] not found` });
            return;
        }

        // Update the concert band
        const { name,
            genre = null,
            origin_country = null,
            rating = null,
            notes = null,
            link = null,
            website = null
        } = bandData;

        const query = `UPDATE ${table_name_ConcertBands} SET name = ?, genre = ?, origin_country = ?, rating = ?, notes = ?, 
            link = ?, website = ? WHERE id = ?`;

        const result = await connection.query(query, [name, genre, origin_country, rating, notes, link, website, id]);

        if (result.affectedRows === 1) {
            res.status(200).json({ message: 'Concert-Band updated successfully' });
        } else {
            res.status(400).json({ message: 'Failed to update Concert-Band' });
        }
    } catch (error) {
        console.error('Error updating Concert-Band:', error);
        res.status(500).json({ message: 'Database error' });
    } finally {
        if (connection) connection.end();
    }
};

export const delete_ConcertBand_ById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let connection;

    if (isNaN(Number(id))) {
        res.status(400).send({ message: 'Invalid ID format' });
        return;
    }

    try {
        connection = await getConnection();
        await connection.beginTransaction();

        const [existingBand] = await connection.query(
            `SELECT * FROM ${table_name_ConcertBands} WHERE id = ?`,
            [id]
        );

        if (!existingBand) {
            await connection.rollback();
            res.status(404).json({ message: `Concert-Band with ID [ ${id} ] not found` });
            return;
        }

        await connection.query(`DELETE FROM ${table_name_EventBands} WHERE band_id = ?`, [id]);
        await connection.query(`DELETE FROM ${table_name_ConcertBands} WHERE id = ?`, [id]);

        await connection.commit();
        res.status(200).json({ message: 'Concert-Band deleted successfully' });
    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error('Rollback failed:', rollbackError);
            }
        }
        console.error('Error deleting Concert-Band:', error);
        res.status(500).json({ message: 'Database error' });
    } finally {
        if (connection) connection.end();
    }
};
