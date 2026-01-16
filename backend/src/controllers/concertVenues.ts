import path from 'path';
import { Request, Response } from 'express';

import { getConnection } from '../config/db';
import JSONSchemaValidator from '../utils/JSONSchemaValidator';


const table_name_ConcertVenues = "ConcertVenues";
const table_name_ConcertEvents = "ConcertEvents";
const schema_ConcertVenue_FilePath = path.resolve(__dirname, "../types/schemas/ConcertVenue.json");

const validator = new JSONSchemaValidator();

export const get_AllConcertVenues = async (req: Request, res: Response) => {
    let connection;
    try {
        connection = await getConnection();
        const rows = await connection.query(`SELECT * FROM ${table_name_ConcertVenues}`);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    } finally {
        if (connection) connection.end();
    }
};

export const get_ConcertVenue_ById = async (req: Request, res: Response) => {
    const { id } = req.params; // Get the 'id' parameter from the request
    let connection;

    if (isNaN(Number(id))) {
        res.status(400).send({ message: 'Invalid ID format' });
        return;
    }

    try {
        connection = await getConnection();
        const query = `SELECT * FROM ${table_name_ConcertVenues} WHERE id = ?`;
        const rows = await connection.query(query, [id]); // Use parameterized query to prevent SQL injection

        if (rows.length === 0) {
            res.status(404).send({ message: 'Concert-Venue not found' });
        }

        res.json(rows[0]); // Send the first result
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Error fetching user');
    } finally {
        if (connection) connection.end();
    }
};

export const create_ConcertVenue = async (req: Request, res: Response) => {
    const venueData = req.body;

    // Validate the incoming request body
    const isValid = validator.validateObject(venueData, schema_ConcertVenue_FilePath);

    if (!isValid) {
        res.status(400).json({ message: 'Invalid data. See server logs for details.' });
        return;
    }

    const { name,
        address = null,
        city = null,
        state = null,
        country = null,
        postal_code = null,
        type = null,
        indoor_outdoor = null,
        capacity = null,
        website = null,
        notes = null,
        latitude = null,
        longitude = null,
        rating = null
    } = venueData;

    let connection;

    try {
        connection = await getConnection();

        // Insert the new venue into the database
        const query = `INSERT INTO ${table_name_ConcertVenues} (name, address, city, state, country, postal_code, type, 
            indoor_outdoor, capacity, website, notes, latitude, longitude, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const result = await connection.query(query, [name, address, city, state, country, postal_code,
            type, indoor_outdoor, capacity, website, notes, latitude, longitude, rating]);

        // Check if the insert was successful
        if (result.affectedRows === 1) {
            console.log(`Concert-Venue created successfully`);
            res.status(201).json({
                message: 'Concert-Venue created successfully',
                venueId: result.insertId.toString(), // Return the ID of the newly created record
            });
        } else {
            console.log(`Error: Failed to create Concert-Venue`);
            res.status(400).json({ message: 'Failed to create Concert-Venue in database' });
        }
    } catch (error) {
        console.error('Error creating Concert-Venue:', error);
        res.status(500).json({ message: 'Error creating Concert-Venue' });
    } finally {
        if (connection) connection.end();
    }
};

export const update_ConcertVenue_ById = async (req: Request, res: Response) => {
    const { id } = req.params; // Get the ID from the URL
    const venueData = req.body;

    // Validate the incoming request body
    const isValid = validator.validateObject(venueData, schema_ConcertVenue_FilePath);

    if (!isValid) {
        res.status(400).json({ message: 'Invalid data. See server logs for details.' });
        return;
    }

    let connection;

    try {
        connection = await getConnection();

        // Check if the concert venue exists
        const [existingVenue] = await connection.query(
            `SELECT * FROM ${table_name_ConcertVenues} WHERE id = ?`,
            [id]
        );

        if (!existingVenue) {
            res.status(404).json({ message: `Concert-Venue with ID [ ${id} ] not found` });
            return;
        }

        // Update the concert venue
        const { name,
            address = null,
            city = null,
            state = null,
            country = null,
            postal_code = null,
            type = null,
            indoor_outdoor = null,
            capacity = null,
            website = null,
            notes = null,
            latitude = null,
            longitude = null,
            rating = null
        } = venueData;

        const query = `UPDATE ${table_name_ConcertVenues} SET name = ?, address = ?, city = ?, state = ?, country = ?, 
            postal_code = ?, type = ?, indoor_outdoor = ?, capacity = ?, website = ?, notes = ?, 
            latitude = ?, longitude = ?, rating = ? WHERE id = ?`;

        const result = await connection.query(query, [name, address, city, state, country, postal_code,
        type, indoor_outdoor, capacity, website, notes, latitude, longitude, rating, id]);

        if (result.affectedRows === 1) {
            res.status(200).json({ message: 'Concert-Venue updated successfully' });
        } else {
            res.status(400).json({ message: 'Failed to update Concert-Venue' });
        }
    } catch (error) {
        console.error('Error updating Concert-Venue:', error);
        res.status(500).json({ message: 'Database error' });
    } finally {
        if (connection) connection.end();
    }
};

export const delete_ConcertVenue_ById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let connection;

    if (isNaN(Number(id))) {
        res.status(400).send({ message: 'Invalid ID format' });
        return;
    }

    try {
        connection = await getConnection();
        await connection.beginTransaction();

        const [existingVenue] = await connection.query(
            `SELECT * FROM ${table_name_ConcertVenues} WHERE id = ?`,
            [id]
        );

        if (!existingVenue) {
            await connection.rollback();
            res.status(404).json({ message: `Concert-Venue with ID [ ${id} ] not found` });
            return;
        }

        const resCountEvents = await connection.query(
            `SELECT COUNT(*) AS total FROM ${table_name_ConcertEvents} WHERE venue_id = ?`,
            [id]
        );
        const countEvents = Number(resCountEvents?.[0]?.total ?? 0);

        if (countEvents > 0) {
            await connection.rollback();
            res.status(409).json({ message: 'Venue is linked to existing events.' });
            return;
        }

        await connection.query(`DELETE FROM ${table_name_ConcertVenues} WHERE id = ?`, [id]);

        await connection.commit();
        res.status(200).json({ message: 'Concert-Venue deleted successfully' });
    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error('Rollback failed:', rollbackError);
            }
        }
        console.error('Error deleting Concert-Venue:', error);
        res.status(500).json({ message: 'Database error' });
    } finally {
        if (connection) connection.end();
    }
};
