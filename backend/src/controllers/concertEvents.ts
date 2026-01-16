import path from 'path';
import { Request, Response } from 'express';

import { getConnection } from '../config/db';
import JSONSchemaValidator from '../utils/JSONSchemaValidator';


const table_name_ConcertEvents = "ConcertEvents";
const table_name_ConcertBands = "ConcertBands";
const table_name_ConcertVenues = "ConcertVenues";
const table_name_EventBands = "EventBands";
const table_name_EventParticipants = "EventParticipants";
const schema_ConcertEvent_FilePath = path.resolve(__dirname, "../types/schemas/ConcertEvent.json");
const schema_ConcertEventBundle_FilePath = path.resolve(__dirname, "../types/schemas/ConcertEventBundle.json");

const validator = new JSONSchemaValidator();

export const get_ConcertOverview = async (req: Request, res: Response) => {
    console.debug('Call: get_ConcertOverview');
    let connection;
    try {
        connection = await getConnection();
        const limitRaw = req.query.limit;
        let limit = Number(limitRaw);
        if (!Number.isFinite(limit) || limit <= 0) {
            limit = 10;
        }

        const rows = await connection.query(
            `SELECT * FROM ${table_name_ConcertEvents} ORDER BY datetime DESC LIMIT ?`,
            [limit]
        );
        console.debug(`-> Return elements [ ${rows.length} ]`);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching Concert-Events:', error);
        res.status(500).send('Error fetching Concert-Events');
    } finally {
        if (connection) connection.end();
    }
};

export const get_AllConcertEvents = async (req: Request, res: Response) => {
    console.debug('Call: get_AllConcertEvents');
    let connection;
    try {
        connection = await getConnection();
        const rows = await connection.query(`SELECT * FROM ${table_name_ConcertEvents}`);
        console.debug(`-> Return elements [ ${rows.length} ]`);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching Concert-Events:', error);
        res.status(500).send('Error fetching Concert-Events');
    } finally {
        if (connection) connection.end();
    }
};

export const get_ConcertEvent_ById = async (req: Request, res: Response) => {
    console.debug('Call: get_ConcertEvent_ById');

    const { id } = req.params; // Get the 'id' parameter from the request
    let connection;

    if (isNaN(Number(id))) {
        res.status(400).send({ message: 'Invalid ID format' });
        return;
    }

    try {
        connection = await getConnection();
        const query = `SELECT * FROM ${table_name_ConcertEvents} WHERE id = ?`;
        const rows = await connection.query(query, [id]); // Use parameterized query to prevent SQL injection

        if (rows.length === 0) {
            res.status(404).send({ message: 'Concert-Event not found' });
        }

        res.json(rows[0]); // Send the first result
    } catch (error) {
        console.error('Error fetching Concert-Events:', error);
        res.status(500).send('Error fetching Concert-Events');
    } finally {
        if (connection) connection.end();
    }
};

export const get_ConcertDetails = async (req: Request, res: Response) => {
    console.debug('Call: get_ConcertDetails');

    const { id } = req.params;
    let connection;

    if (isNaN(Number(id))) {
        res.status(400).send({ message: 'Invalid ID format' });
        return;
    }

    try {
        connection = await getConnection();

        const eventRows = await connection.query(
            `SELECT id, name, datetime, venue_id, rating FROM ${table_name_ConcertEvents} WHERE id = ?`,
            [id]
        );

        if (eventRows.length === 0) {
            res.status(404).send({ message: 'Concert-Event not found' });
            return;
        }

        const event = eventRows[0];

        const venueRows = await connection.query(
            `SELECT name FROM ConcertVenues WHERE id = ?`,
            [event.venue_id]
        );
        const venueName = venueRows?.[0]?.name ?? null;

        const bands = await connection.query(
            `SELECT b.id, b.name, eb.mainAct, eb.runningOrder, eb.rating
             FROM EventBands eb
             JOIN ConcertBands b ON b.id = eb.band_id
             WHERE eb.event_id = ?
             ORDER BY eb.runningOrder DESC, b.name`,
            [id]
        );

        const participants = await connection.query(
            `SELECT p.id, p.name
             FROM EventParticipants ep
             JOIN ConcertParticipants p ON p.id = ep.participant_id
             WHERE ep.event_id = ?
             ORDER BY p.name`,
            [id]
        );

        res.json({
            id: event.id,
            date: event.datetime,
            name: event.name,
            rating: event.rating ?? 0,
            venueName,
            bands: bands.map((band: any) => ({
                id: band.id,
                name: band.name,
                mainAct: band.mainAct === null ? false : Boolean(band.mainAct),
                runningOrder: band.runningOrder ?? null,
                rating: band.rating ?? null,
            })),
            participatedWith: participants.map((participant: any) => ({
                id: participant.id,
                displayName: participant.name
            }))
        });
    } catch (error) {
        console.error('Error fetching Concert-Event details:', error);
        res.status(500).send('Error fetching Concert-Event details');
    } finally {
        if (connection) connection.end();
    }
};

export const create_ConcertEvent = async (req: Request, res: Response) => {
    console.debug('Call: create_ConcertEvent');

    const eventData = req.body;

    // Validate the incoming request body
    const isValid = validator.validateObject(eventData, schema_ConcertEvent_FilePath);

    if (!isValid) {
        res.status(400).json({ message: 'Invalid data. See server logs for details.' });
        return;
    }

    const { name,
        datetime,
        venue_id,
        rating,
        notes = null
    } = eventData;

    let connection;

    try {
        connection = await getConnection();

        // Insert the new venue into the database
        const query = `INSERT INTO ${table_name_ConcertEvents} (name, datetime, venue_id, rating, notes) 
            VALUES (?, ?, ?, ?, ?)`;

        const result = await connection.query(query, [name, datetime, venue_id, rating, notes]);

        // Check if the insert was successful
        if (result.affectedRows === 1) {
            console.log(`Concert-Event created successfully`);
            res.status(201).json({
                message: 'Concert-Event created successfully',
                eventId: result.insertId.toString(), // Return the ID of the newly created record
            });
        } else {
            console.log(`Error: Failed to create Concert-Event`);
            res.status(400).json({ message: 'Failed to create Concert-Event in database' });
        }
    } catch (error) {
        console.error('Error creating Concert-Event:', error);
        res.status(500).json({ message: 'Error creating Concert-Event' });
    } finally {
        if (connection) connection.end();
    }
};

export const create_ConcertEvent_WithBands = async (req: Request, res: Response) => {
    console.debug('Call: create_ConcertEvent_WithBands');

    const bundleData = req.body;
    const isValid = validator.validateObject(bundleData, schema_ConcertEventBundle_FilePath);

    if (!isValid) {
        res.status(400).json({ message: 'Invalid data. See server logs for details.' });
        return;
    }

    const { event, venueId, venue, bands } = bundleData as {
        event: { name: string; datetime: string; rating?: number | null; notes?: string | null };
        venueId?: number;
        venue?: any;
        bands: Array<any>;
    };

    let connection;

    try {
        connection = await getConnection();
        await connection.beginTransaction();

        let resolvedVenueId = venueId;
        if (!resolvedVenueId) {
            if (!venue || !venue.name) {
                throw new Error('Missing venue data.');
            }

            const venueQuery = `INSERT INTO ConcertVenues (name, address, city, state, country, postal_code, type, 
                indoor_outdoor, capacity, website, notes, latitude, longitude, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const venueValues = [
                venue.name,
                venue.address ?? null,
                venue.city ?? null,
                venue.state ?? null,
                venue.country ?? null,
                venue.postal_code ?? null,
                venue.type ?? null,
                venue.indoor_outdoor ?? null,
                venue.capacity ?? null,
                venue.website ?? null,
                venue.notes ?? null,
                venue.latitude ?? null,
                venue.longitude ?? null,
                venue.rating ?? null,
            ];

            const venueResult = await connection.query(venueQuery, venueValues);
            resolvedVenueId = Number(venueResult.insertId);
        }

        if (!resolvedVenueId) {
            throw new Error('Missing venue selection.');
        }

        const eventQuery = `INSERT INTO ${table_name_ConcertEvents} (name, datetime, venue_id, rating, notes) VALUES (?, ?, ?, ?, ?)`;
        const eventValues = [
            event.name,
            event.datetime,
            resolvedVenueId,
            event.rating ?? null,
            event.notes ?? null,
        ];
        const eventResult = await connection.query(eventQuery, eventValues);
        const eventId = Number(eventResult.insertId);

        if (!eventId) {
            throw new Error('Failed to create Concert-Event.');
        }

        const bandIds: number[] = [];
        const eventBandIds: number[] = [];

        for (let index = 0; index < bands.length; index += 1) {
            const entry = bands[index] ?? {};
            let bandId = entry.bandId;

            if (!bandId) {
                const band = entry.band;
                if (!band || !band.name) {
                    throw new Error('Missing band data.');
                }

                const bandQuery = `INSERT INTO ${table_name_ConcertBands} (name, genre, origin_country, rating, notes, link, website) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;
                const bandValues = [
                    band.name,
                    band.genre ?? null,
                    band.origin_country ?? null,
                    band.rating ?? null,
                    band.notes ?? null,
                    band.link ?? null,
                    band.website ?? null,
                ];

                const bandResult = await connection.query(bandQuery, bandValues);
                bandId = Number(bandResult.insertId);
            }

            if (!bandId) {
                throw new Error('Failed to create Concert-Band.');
            }

            bandIds.push(bandId);

            const eventBandQuery = `INSERT INTO ${table_name_EventBands} (event_id, band_id, setlist, rating, mainAct, runningOrder, notes) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

            const runningOrder = entry.runningOrder ?? entry.running_order ?? index + 1;
            const mainAct = entry.mainAct ?? entry.main_act ?? false;

            const eventBandValues = [
                eventId,
                bandId,
                entry.setlist ?? null,
                entry.rating ?? null,
                mainAct,
                runningOrder,
                entry.notes ?? null,
            ];

            const eventBandResult = await connection.query(eventBandQuery, eventBandValues);
            eventBandIds.push(Number(eventBandResult.insertId));
        }

        await connection.commit();

        res.status(201).json({
            message: 'Concert-Event bundle created successfully',
            eventId,
            venueId: resolvedVenueId,
            bandIds,
            eventBandIds,
        });
    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error('Rollback failed:', rollbackError);
            }
        }
        console.error('Error creating Concert-Event bundle:', error);
        res.status(500).json({ message: 'Error creating Concert-Event bundle' });
    } finally {
        if (connection) connection.end();
    }
};

export const update_ConcertEvent_ById = async (req: Request, res: Response) => {
    console.debug('Call: update_ConcertEvent_ById');

    const { id } = req.params; // Get the ID from the URL
    const eventData = req.body;

    // Validate the incoming request body
    const isValid = validator.validateObject(eventData, schema_ConcertEvent_FilePath);

    if (!isValid) {
        res.status(400).json({ message: 'Invalid data. See server logs for details.' });
        return;
    }

    let connection;

    try {
        connection = await getConnection();

        // Check if the concert venue exists
        const [existingVenue] = await connection.query(
            `SELECT * FROM ${table_name_ConcertEvents} WHERE id = ?`,
            [id]
        );

        if (!existingVenue) {
            res.status(404).json({ message: `Concert-Event with ID [ ${id} ] not found` });
            return;
        }

        // Update the concert event
        const { name,
            datetime,
            venue_id,
            rating,
            notes = null
        } = eventData;

        const query = `UPDATE ${table_name_ConcertEvents} SET name = ?, datetime = ?, venue_id = ?, 
            rating = ?, notes = ? WHERE id = ?`;

        const result = await connection.query(query, [name, datetime, venue_id, rating, notes, id]);

        if (result.affectedRows === 1) {
            res.status(200).json({ message: 'Concert-Event updated successfully' });
        } else {
            res.status(400).json({ message: 'Failed to update Concert-Event' });
        }
    } catch (error) {
        console.error('Error updating Concert-Event:', error);
        res.status(500).json({ message: 'Database error' });
    } finally {
        if (connection) connection.end();
    }
};

export const update_ConcertEvent_WithBands = async (req: Request, res: Response) => {
    console.debug('Call: update_ConcertEvent_WithBands');

    const { id } = req.params;
    const bundleData = req.body;

    if (isNaN(Number(id))) {
        res.status(400).send({ message: 'Invalid ID format' });
        return;
    }

    const isValid = validator.validateObject(bundleData, schema_ConcertEventBundle_FilePath);
    if (!isValid) {
        res.status(400).json({ message: 'Invalid data. See server logs for details.' });
        return;
    }

    const { event, venueId, venue, bands } = bundleData as {
        event: { name: string; datetime: string; rating?: number | null; notes?: string | null };
        venueId?: number;
        venue?: any;
        bands: Array<any>;
    };

    let connection;

    try {
        connection = await getConnection();
        await connection.beginTransaction();

        const [existingEvent] = await connection.query(
            `SELECT * FROM ${table_name_ConcertEvents} WHERE id = ?`,
            [id]
        );

        if (!existingEvent) {
            await connection.rollback();
            res.status(404).json({ message: `Concert-Event with ID [ ${id} ] not found` });
            return;
        }

        let resolvedVenueId = venueId ?? existingEvent.venue_id;

        if (venue) {
            if (venueId) {
                const venueUpdateQuery = `UPDATE ${table_name_ConcertVenues} SET name = ?, address = ?, city = ?, state = ?, country = ?,
                    postal_code = ?, type = ?, indoor_outdoor = ?, capacity = ?, website = ?, notes = ?, latitude = ?, longitude = ?, rating = ?
                    WHERE id = ?`;

                const venueUpdateValues = [
                    venue.name,
                    venue.address ?? null,
                    venue.city ?? null,
                    venue.state ?? null,
                    venue.country ?? null,
                    venue.postal_code ?? null,
                    venue.type ?? null,
                    venue.indoor_outdoor ?? null,
                    venue.capacity ?? null,
                    venue.website ?? null,
                    venue.notes ?? null,
                    venue.latitude ?? null,
                    venue.longitude ?? null,
                    venue.rating ?? null,
                    venueId,
                ];

                await connection.query(venueUpdateQuery, venueUpdateValues);
                resolvedVenueId = venueId;
            } else {
                const venueQuery = `INSERT INTO ${table_name_ConcertVenues} (name, address, city, state, country, postal_code, type,
                    indoor_outdoor, capacity, website, notes, latitude, longitude, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                const venueValues = [
                    venue.name,
                    venue.address ?? null,
                    venue.city ?? null,
                    venue.state ?? null,
                    venue.country ?? null,
                    venue.postal_code ?? null,
                    venue.type ?? null,
                    venue.indoor_outdoor ?? null,
                    venue.capacity ?? null,
                    venue.website ?? null,
                    venue.notes ?? null,
                    venue.latitude ?? null,
                    venue.longitude ?? null,
                    venue.rating ?? null,
                ];

                const venueResult = await connection.query(venueQuery, venueValues);
                resolvedVenueId = Number(venueResult.insertId);
            }
        }

        if (!resolvedVenueId) {
            throw new Error('Missing venue selection.');
        }

        const eventUpdateQuery = `UPDATE ${table_name_ConcertEvents} SET name = ?, datetime = ?, venue_id = ?, rating = ?, notes = ? WHERE id = ?`;
        const eventUpdateValues = [
            event.name,
            event.datetime,
            resolvedVenueId,
            event.rating ?? null,
            event.notes ?? null,
            id,
        ];
        await connection.query(eventUpdateQuery, eventUpdateValues);

        await connection.query(`DELETE FROM ${table_name_EventBands} WHERE event_id = ?`, [id]);

        const bandIds: number[] = [];
        const eventBandIds: number[] = [];

        for (let index = 0; index < bands.length; index += 1) {
            const entry = bands[index] ?? {};
            let bandId = entry.bandId;

            if (!bandId) {
                const band = entry.band;
                if (!band || !band.name) {
                    throw new Error('Missing band data.');
                }

                const bandQuery = `INSERT INTO ${table_name_ConcertBands} (name, genre, origin_country, rating, notes, link, website)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;
                const bandValues = [
                    band.name,
                    band.genre ?? null,
                    band.origin_country ?? null,
                    band.rating ?? null,
                    band.notes ?? null,
                    band.link ?? null,
                    band.website ?? null,
                ];
                const bandResult = await connection.query(bandQuery, bandValues);
                bandId = Number(bandResult.insertId);
            }

            if (!bandId) {
                throw new Error('Failed to create Concert-Band.');
            }

            bandIds.push(bandId);

            const eventBandQuery = `INSERT INTO ${table_name_EventBands} (event_id, band_id, setlist, rating, mainAct, runningOrder, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

            const runningOrder = entry.runningOrder ?? entry.running_order ?? index + 1;
            const mainAct = entry.mainAct ?? entry.main_act ?? false;

            const eventBandValues = [
                id,
                bandId,
                entry.setlist ?? null,
                entry.rating ?? null,
                mainAct,
                runningOrder,
                entry.notes ?? null,
            ];

            const eventBandResult = await connection.query(eventBandQuery, eventBandValues);
            eventBandIds.push(Number(eventBandResult.insertId));
        }

        await connection.commit();

        res.status(200).json({
            message: 'Concert-Event bundle updated successfully',
            eventId: Number(id),
            venueId: resolvedVenueId,
            bandIds,
            eventBandIds,
        });
    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error('Rollback failed:', rollbackError);
            }
        }
        console.error('Error updating Concert-Event bundle:', error);
        res.status(500).json({ message: 'Error updating Concert-Event bundle' });
    } finally {
        if (connection) connection.end();
    }
};

export const delete_ConcertEvent_ById = async (req: Request, res: Response) => {
    console.debug('Call: delete_ConcertEvent_ById');

    const { id } = req.params;
    let connection;

    if (isNaN(Number(id))) {
        res.status(400).send({ message: 'Invalid ID format' });
        return;
    }

    try {
        connection = await getConnection();
        await connection.beginTransaction();

        await connection.query(`DELETE FROM ${table_name_EventBands} WHERE event_id = ?`, [id]);
        await connection.query(`DELETE FROM ${table_name_EventParticipants} WHERE event_id = ?`, [id]);

        const result = await connection.query(`DELETE FROM ${table_name_ConcertEvents} WHERE id = ?`, [id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            res.status(404).json({ message: `Concert-Event with ID [ ${id} ] not found` });
            return;
        }

        await connection.commit();
        res.status(200).json({ message: 'Concert-Event deleted successfully' });
    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error('Rollback failed:', rollbackError);
            }
        }
        console.error('Error deleting Concert-Event:', error);
        res.status(500).json({ message: 'Database error' });
    } finally {
        if (connection) connection.end();
    }
};
