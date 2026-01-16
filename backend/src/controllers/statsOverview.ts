import { Request, Response } from 'express';

import { getConnection } from '../config/db';

const table_name_ConcertEvents = 'ConcertEvents';
const table_name_ConcertBands = 'ConcertBands';
const table_name_ConcertVenues = 'ConcertVenues';
const table_name_EventBands = 'EventBands';

export const get_StatsOverview = async (req: Request, res: Response) => {
    console.debug('Call: get_StatsOverview');

    let connection;
    try {
        connection = await getConnection();

        // Get number of attended concerts
        const resCountConcerts = await connection.query(`SELECT COUNT(*) AS total FROM ${table_name_ConcertEvents}`);
        const countConcerts = Number(resCountConcerts?.[0]?.total ?? 0);

        // Get number of seen bands
        const resCountBands = await connection.query(`SELECT COUNT(*) AS total FROM ${table_name_ConcertBands}`);
        const countBands = Number(resCountBands?.[0]?.total ?? 0);

        // Get number of seen acts
        const resCountActs = await connection.query(`SELECT COUNT(*) AS total FROM ${table_name_EventBands}`);
        const countActs = Number(resCountActs?.[0]?.total ?? 0);

        // Get number of seen venues
        const resCountVenues = await connection.query(`SELECT COUNT(*) AS total FROM ${table_name_ConcertVenues}`);
        const countVenues = Number(resCountVenues?.[0]?.total ?? 0);

        const statsOverview = {
            concertsAttended: countConcerts,
            bandsSeen: countBands,
            actsSeen: countActs,
            venuesSeen: countVenues
        };

        console.debug(`-> Return [ ${JSON.stringify(statsOverview)} ]`);
        
        res.json(statsOverview);
    } catch (error) {
        console.error('Error fetching StatsOverview:', error);
        res.status(500).send('Error fetching StatsOverview');
    } finally {
        if (connection) connection.end();
    }
};
