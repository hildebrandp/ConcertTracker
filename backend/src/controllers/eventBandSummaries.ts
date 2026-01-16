import { Request, Response } from 'express';

import { getConnection } from '../config/db';

const table_name_ConcertBands = 'ConcertBands';
const table_name_ConcertEvents = 'ConcertEvents';
const table_name_ConcertVenues = 'ConcertVenues';
const table_name_EventBands = 'EventBands';

export const get_EventBandSummaries = async (_req: Request, res: Response) => {
    console.debug('Call: get_EventBandSummaries');

    let connection;
    try {
        connection = await getConnection();

        const query = `
            SELECT
                CAST(eb.id AS SIGNED) AS event_band_id,
                CAST(e.id AS SIGNED) AS event_id,
                e.datetime AS date,
                e.name AS event_name,
                b.name AS band_name,
                v.name AS venue_name,
                eb.rating AS rating
            FROM ${table_name_EventBands} eb
            JOIN ${table_name_ConcertEvents} e ON e.id = eb.event_id
            JOIN ${table_name_ConcertBands} b ON b.id = eb.band_id
            JOIN ${table_name_ConcertVenues} v ON v.id = e.venue_id
            ORDER BY e.datetime DESC, b.name ASC
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

        console.debug(`-> Return elements [ ${serializedRows.length} ]`);
        res.json(serializedRows);
    } catch (error) {
        console.error('Error fetching Event-Band summaries:', error);
        res.status(500).send('Error fetching Event-Band summaries');
    } finally {
        if (connection) connection.end();
    }
};
