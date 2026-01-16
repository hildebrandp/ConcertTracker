import mariadb from 'mariadb';
import dotenv from 'dotenv';
dotenv.config();

const pool = mariadb.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	allowPublicKeyRetrieval: true,
	connectionLimit: 5,
});

export const getConnection = async () => {
	try {
		return await pool.getConnection();
	} catch (error) {
		console.error('Error connecting to the database:', error);
		throw error;
	}
};
