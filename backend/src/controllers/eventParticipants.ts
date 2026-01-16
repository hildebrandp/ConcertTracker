import path from 'path';
import { Request, Response } from 'express';

import { getConnection } from '../config/db';
import JSONSchemaValidator from '../utils/JSONSchemaValidator';


const table_name = "EventParticipants";
const schema_EventParticipant_FilePath = path.resolve(__dirname, "../types/schemas/EventParticipant.json");

const validator = new JSONSchemaValidator();

export const get_AllEventParticipants = async (req: Request, res: Response) => {
    let connection;
    try {
        connection = await getConnection();
        const rows = await connection.query(`SELECT * FROM ${table_name}`);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching Event-Participants:', error);
        res.status(500).send('Error fetching Event-Participants');
    } finally {
        if (connection) connection.end();
    }
};

export const get_EventParticipant_ById = async (req: Request, res: Response) => {
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
            res.status(404).send({ message: 'Event-Participant not found' });
        }

        res.json(rows[0]); // Send the first result
    } catch (error) {
        console.error('Error fetching Event-Participants:', error);
        res.status(500).send('Error fetching Event-Participants');
    } finally {
        if (connection) connection.end();
    }
};

export const create_EventParticipant = async (req: Request, res: Response) => {
    const participantData = req.body;

    // Validate the incoming request body
    const isValid = validator.validateObject(participantData, schema_EventParticipant_FilePath);

    if (!isValid) {
        res.status(400).json({ message: 'Invalid data. See server logs for details.' });
        return;
    }

    const { participant_id,
        event_id
    } = participantData;

    let connection;

    try {
        connection = await getConnection();

        // Insert the new venue into the database
        const query = `INSERT INTO ${table_name} (participant_id, event_id) VALUES (?, ?)`;

        const result = await connection.query(query, [participant_id, event_id]);

        // Check if the insert was successful
        if (result.affectedRows === 1) {
            console.log(`Event-Participant created successfully`);
            res.status(201).json({
                message: 'Event-Participant created successfully',
                venueId: result.insertId.toString(), // Return the ID of the newly created record
            });
        } else {
            console.log(`Error: Failed to create Event-Participant`);
            res.status(400).json({ message: 'Failed to create Event-Participant in database' });
        }
    } catch (error) {
        console.error('Error creating Event-Participant:', error);
        res.status(500).json({ message: 'Error creating Event-Participant' });
    } finally {
        if (connection) connection.end();
    }
};

export const update_EventParticipant_ById = async (req: Request, res: Response) => {
    const { id } = req.params; // Get the ID from the URL
    const participantData = req.body;

    // Validate the incoming request body
    const isValid = validator.validateObject(participantData, schema_EventParticipant_FilePath);

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
            res.status(404).json({ message: `Event-Participant with ID [ ${id} ] not found` });
            return;
        }

        // Update the event participant
        const { participant_id,
            event_id
        } = participantData;

        const query = `UPDATE ${table_name} SET participant_id = ?, event_id = ? WHERE id = ?`;

        const result = await connection.query(query, [participant_id, event_id, id]);

        if (result.affectedRows === 1) {
            res.status(200).json({ message: 'Event-Participant updated successfully' });
        } else {
            res.status(400).json({ message: 'Failed to update Event-Participant' });
        }
    } catch (error) {
        console.error('Error updating Event-Participant:', error);
        res.status(500).json({ message: 'Database error' });
    } finally {
        if (connection) connection.end();
    }
};