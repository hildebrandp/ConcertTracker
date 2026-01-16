import { Request, Response } from 'express';
import { getConnection } from '../config/db';

export const clear_AllData = async (_req: Request, res: Response) => {
    console.debug('Call: clear_AllData');
    let connection;

    try {
        connection = await getConnection();
        await connection.beginTransaction();

        await connection.query('DELETE FROM EventParticipants');
        await connection.query('DELETE FROM EventBands');
        await connection.query('DELETE FROM ConcertEvents');
        await connection.query('DELETE FROM ConcertBands');
        await connection.query('DELETE FROM ConcertVenues');
        await connection.query('DELETE FROM ConcertParticipants');

        await connection.commit();
        res.status(200).json({ message: 'All data deleted successfully' });
    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error('Rollback failed:', rollbackError);
            }
        }
        console.error('Error deleting all data:', error);
        res.status(500).json({ message: 'Database error' });
    } finally {
        if (connection) connection.end();
    }
};
