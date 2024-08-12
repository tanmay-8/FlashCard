const { v4: uuidv4 } = require("uuid");
const { query } = require("../db");
const { validationResult } = require("express-validator");

const createFlashcardSet = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const role = req.user.role.toLowerCase();
        if (role !== "admin") {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        const { set_name, description } = req.body;
        const created_by = req.user.id;

        const set_id = uuidv4();

        await query(
            `INSERT INTO flashcard_sets (set_id, set_name, description, created_by, created_at)
            VALUES (?, ?, ?, ?, NOW())`,
            [set_id, set_name, description, created_by]
        );

        res.status(201).json({
            msg: "Flashcard set created successfully",
            set_id,
        });
    } catch (err) {
        console.error("Error creating flashcard set:", err.message);
        res.status(500).send("Server Error");
    }
};

const createFlashcard = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (req.user.role.toLowerCase() !== "admin") {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        const { question, answer, question_type, options, set_id } = req.body;

        const created_by = req.user.id;

        const flashcard_id = uuidv4();

        await query(
            `
            INSERT INTO flashcards (flashcard_id, question, answer, question_type, created_by, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `,
            [flashcard_id, question, answer, question_type, created_by]
        );

        if (options.length > 0) {
            const optionInserts = options.map((option) => [
                uuidv4(),
                flashcard_id,
                option.option_text,
                option.is_correct,
            ]);

            await query(
                `
                INSERT INTO flashcard_options (option_id, flashcard_id, option_text, is_correct)
                VALUES ? 
            `,
                [optionInserts]
            );
        }

        const relationship_id = uuidv4();
        await query(
            `
                INSERT INTO flashcard_set_relationships (id, flashcard_id, set_id)
                VALUES (?, ?, ?)
                `,
            [relationship_id, flashcard_id, set_id]
        );

        res.status(201).json({
            msg: "Flashcard created successfully",
            flashcard_id,
        });
    } catch (err) {
        console.error("Error creating flashcard:", err.message);
        res.status(500).send("Server Error");
    }
};

const getAllSets = async (req, res) => {
    try {
        const sets = await query("SELECT * FROM flashcard_sets");
        res.status(200).json({
            sets: sets,
        });
    } catch (err) {
        console.error("Error getting flashcard sets:", err.message);
        res.status(500).send("Server Error");
    }
};

const getAllFlashCardsFromSet = async (req, res) => {
    try {
        const set_id = req.params.set_id;
        console.log(set_id);
        const flashcards = await query(
            `SELECT * FROM flashcards
            WHERE flashcard_id IN (
                SELECT flashcard_id FROM flashcard_set_relationships
                WHERE set_id = ?
            )`,
            [set_id]
        );
        console.log(flashcards);
        res.status(200).json({
            flashcards: flashcards,
        });
    } catch (err) {
        console.error("Error getting flashcards from set:", err.message);
        res.status(500).send("Server Error");
    }
};

const getFlashcard = async (req, res) => {
    try {
        const flashcard_id = req.params.flashcard_id;
        const flashcard = await query(
            "SELECT * FROM flashcards WHERE flashcard_id = ?",
            [flashcard_id]
        );
        res.status(200).json(flashcard);
    } catch (err) {
        console.error("Error getting flashcard:", err.message);
        res.status(500).send("Server Error");
    }
};
module.exports = {
    createFlashcard,
    createFlashcardSet,
    getAllSets,
    getAllFlashCardsFromSet,
    getFlashcard,
};
