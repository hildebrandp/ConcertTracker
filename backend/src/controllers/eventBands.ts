import path from 'path';
import { Request, Response } from 'express';

import { getConnection } from '../config/db';
import JSONSchemaValidator from '../utils/JSONSchemaValidator';


const table_name = "EventBands";
const schema_EventBand_FilePath = path.resolve(__dirname, "../types/schemas/EventBand.json");

const validator = new JSONSchemaValidator();

export const get_AllEventBands = async (req: Request, res: Response) => {
    let connection;
    try {
        connection = await getConnection();
        const rows = await connection.query(`SELECT * FROM ${table_name}`);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching Event-Bands:', error);
        res.status(500).send('Error fetching Event-Bands');
    } finally {
        if (connection) connection.end();
    }
};

export const get_AllEventBands_ByEventId = async (req: Request, res: Response) => {
    const { id } = req.params; // Get the 'id' parameter from the request
    let connection;

    if (isNaN(Number(id))) {
        res.status(400).send({ message: 'Invalid ID format' });
        return;
    }

    try {
        connection = await getConnection();
        const query = `SELECT COUNT(*) AS total FROM ${table_name} WHERE event_id = ?`;
        const resCountBands = await connection.query(query, [id]); // Use parameterized query to prevent SQL injection
        const countBands = Number(resCountBands?.[0]?.total ?? 0);

        res.json({count: countBands});
    } catch (error) {
        console.error('Error fetching Event-Bands:', error);
        res.status(500).send('Error fetching Event-Bands');
    } finally {
        if (connection) connection.end();
    }
};

export const get_AllEventBands_Details_ByEventId = async (req: Request, res: Response) => {
    const { id } = req.params;
    let connection;

    if (isNaN(Number(id))) {
        res.status(400).send({ message: 'Invalid ID format' });
        return;
    }

    try {
        connection = await getConnection();
        const query = `SELECT eb.id AS event_band_id, eb.band_id, b.name AS band_name,
            eb.mainAct, eb.runningOrder, eb.rating, eb.notes
            FROM ${table_name} eb
            JOIN ConcertBands b ON b.id = eb.band_id
            WHERE eb.event_id = ?
            ORDER BY eb.runningOrder ASC, b.name`;
        const rows = await connection.query(query, [id]);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching Event-Bands:', error);
        res.status(500).send('Error fetching Event-Bands');
    } finally {
        if (connection) connection.end();
    }
};
export const get_EventBand_ById = async (req: Request, res: Response) => {
    const { id } = req.params; // Get the 'id' parameter from the request
    let connection;

    if (isNaN(Number(id))) {
        res.status(400).send({ message: 'Invalid ID format' });
        return;
    }

    try {
        connection = await getConnection();
        const query = `SELECT * FROM ${table_name} WHERE id = ?`;
        const rows = await connection.query(query, [id]); // Use parameterized query to prevent SQL injection

        if (rows.length === 0) {
            res.status(404).send({ message: 'Event-Band not found' });
        }

        res.json(rows[0]); // Send the first result
    } catch (error) {
        console.error('Error fetching Event-Bands:', error);
        res.status(500).send('Error fetching Event-Bands');
    } finally {
        if (connection) connection.end();
    }
};

export const create_EventBand = async (req: Request, res: Response) => {
    const bandData = req.body;

    // Validate the incoming request body
    const isValid = validator.validateObject(bandData, schema_EventBand_FilePath);

    if (!isValid) {
        res.status(400).json({ message: 'Invalid data. See server logs for details.' });
        return;
    }

    const { event_id,
        band_id,
        setlist = null,
        rating = null,
        mainAct = false,
        runningOrder = null,
        notes = null
    } = bandData;

    let connection;

    try {
        connection = await getConnection();

        // Insert the new venue into the database
        const query = `INSERT INTO ${table_name} (event_id, band_id, setlist, rating, mainAct, runningOrder, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const result = await connection.query(query, [event_id, band_id, setlist, rating, mainAct, runningOrder, notes]);

        // Check if the insert was successful
        if (result.affectedRows === 1) {
            console.log(`Event-Band created successfully`);
            res.status(201).json({
                message: 'Event-Band created successfully',
                venueId: result.insertId.toString(), // Return the ID of the newly created record
            });
        } else {
            console.log(`Error: Failed to create Event-Band`);
            res.status(400).json({ message: 'Failed to create Event-Band in database' });
        }
    } catch (error) {
        console.error('Error creating Event-Band:', error);
        res.status(500).json({ message: 'Error creating Event-Band' });
    } finally {
        if (connection) connection.end();
    }
};

export const update_EventBand_ById = async (req: Request, res: Response) => {
    const { id } = req.params; // Get the ID from the URL
    const bandData = req.body;

    // Validate the incoming request body
    const isValid = validator.validateObject(bandData, schema_EventBand_FilePath);

    if (!isValid) {
        res.status(400).json({ message: 'Invalid data. See server logs for details.' });
        return;
    }

    let connection;

    try {
        connection = await getConnection();

        // Check if the concert venue exists
        const [existingVenue] = await connection.query(
            `SELECT * FROM ${table_name} WHERE id = ?`,
            [id]
        );

        if (!existingVenue) {
            res.status(404).json({ message: `Event-Band with ID [ ${id} ] not found` });
            return;
        }

        // Update the event band
        const { event_id,
            band_id,
            setlist = null,
            rating = null,
            mainAct = false,
            runningOrder = null,
            notes = null
        } = bandData;

        const query = `UPDATE ${table_name} SET event_id = ?, band_id = ?, setlist = ?, rating = ?, mainAct = ?, runningOrder = ?, notes = ? WHERE id = ?`;

        const result = await connection.query(query, [event_id, band_id, setlist, rating, mainAct, runningOrder, notes, id]);

        if (result.affectedRows === 1) {
            res.status(200).json({ message: 'Event-Band updated successfully' });
        } else {
            res.status(400).json({ message: 'Failed to update Event-Band' });
        }
    } catch (error) {
        console.error('Error updating Event-Band:', error);
        res.status(500).json({ message: 'Database error' });
    } finally {
        if (connection) connection.end();
    }
};
