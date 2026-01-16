import { Request, Response } from 'express';

import { getConnection } from '../config/db';

const table_name_ConcertBands = 'ConcertBands';
const table_name_ConcertEvents = 'ConcertEvents';
const table_name_ConcertVenues = 'ConcertVenues';
const table_name_EventBands = 'EventBands';

export const get_BandSummaries = async (_req: Request, res: Response) => {
    console.debug('Call: get_BandSummaries');

    let connection;
    try {
        connection = await getConnection();

        const query = `
            SELECT
                CAST(b.id AS SIGNED) AS band_id,
                b.name AS band_name,
                MAX(e.datetime) AS last_seen_date,
                CAST(COUNT(eb.id) AS SIGNED) AS seen_count,
                b.rating AS rating,
                (
                    SELECT e2.name
                    FROM ${table_name_EventBands} eb2
                    JOIN ${table_name_ConcertEvents} e2 ON e2.id = eb2.event_id
                    WHERE eb2.band_id = b.id
                    ORDER BY e2.datetime DESC
                    LIMIT 1
                ) AS last_event_name,
                (
                    SELECT v.name
                    FROM ${table_name_EventBands} eb2
                    JOIN ${table_name_ConcertEvents} e2 ON e2.id = eb2.event_id
                    JOIN ${table_name_ConcertVenues} v ON v.id = e2.venue_id
                    WHERE eb2.band_id = b.id
                    ORDER BY e2.datetime DESC
                    LIMIT 1
                ) AS last_venue_name
            FROM ${table_name_ConcertBands} b
            JOIN ${table_name_EventBands} eb ON eb.band_id = b.id
            JOIN ${table_name_ConcertEvents} e ON e.id = eb.event_id
            GROUP BY b.id, b.name, b.rating
            ORDER BY last_seen_date DESC, band_name ASC
        `;

        const rows = await connection.query(query);
        const serializedRows = rows.map((row: any) =>
            Object.fromEntries(
                Object.entries(row).map(([key, value]) => [
                    key,
                    typeof value === "bigint" ? Number(value) : value,
                ])
            )
        );
        console.debug(`-> Return elements [ ${rows.length} ]`);
        res.json(serializedRows);
    } catch (error) {
        console.error('Error fetching Band summaries:', error);
        res.status(500).send('Error fetching Band summaries');
    } finally {
        if (connection) connection.end();
    }
};

