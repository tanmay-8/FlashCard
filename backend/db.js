const mysql = require("mysql2/promise");

require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 60000,
});

const query = async (sql, params) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(sql, params);
        return rows;
    } catch (e) {
        throw e;
    }
};

const createTables = async () => {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id CHAR(36) PRIMARY KEY,
                email VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await query(`
            CREATE TABLE IF NOT EXISTS flashcards (
                flashcard_id CHAR(36) PRIMARY KEY,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                question_type TINYINT NOT NULL, -- 0 for MCQ, 1 for True/False, 2 for Text
                created_by CHAR(36) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(user_id)
            );
        `);

        await query(`
            CREATE TABLE IF NOT EXISTS flashcard_options (
                option_id CHAR(36) PRIMARY KEY,
                flashcard_id CHAR(36) NOT NULL,
                option_text VARCHAR(255) NOT NULL,
                is_correct BOOLEAN NOT NULL,
                FOREIGN KEY (flashcard_id) REFERENCES flashcards(flashcard_id)
            );
        `);

        await query(`
            CREATE TABLE IF NOT EXISTS flashcard_sets (
                set_id CHAR(36) PRIMARY KEY,
                set_name VARCHAR(100) NOT NULL,
                description TEXT,
                created_by CHAR(36) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(user_id)
            );
        `);

        await query(`
            CREATE TABLE IF NOT EXISTS flashcard_set_relationships (
                id CHAR(36) PRIMARY KEY,
                flashcard_id CHAR(36) NOT NULL,
                set_id CHAR(36) NOT NULL,
                FOREIGN KEY (flashcard_id) REFERENCES flashcards(flashcard_id),
                FOREIGN KEY (set_id) REFERENCES flashcard_sets(set_id)
            );
        `);

        await query(`
            CREATE TABLE IF NOT EXISTS user_progress (
                progress_id CHAR(36) PRIMARY KEY,
                user_id CHAR(36) NOT NULL,
                flashcard_id CHAR(36) NOT NULL,
                set_id CHAR(36) NOT NULL,
                status ENUM('new', 'in_progress', 'completed') DEFAULT 'new',
                last_studied_at TIMESTAMP,
                quiz_score DECIMAL(5, 2),
                FOREIGN KEY (user_id) REFERENCES users(user_id),
                FOREIGN KEY (flashcard_id) REFERENCES flashcards(flashcard_id),
                FOREIGN KEY (set_id) REFERENCES flashcard_sets(set_id)
            );
        `);

        console.log("All tables created successfully!");
    } catch (error) {
        console.error("Error creating tables: ", error);
    }
};

module.exports = {
    query,
    createTables,
};
