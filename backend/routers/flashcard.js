const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
    createFlashcard,
    createFlashcardSet,
    getAllSets,
    getAllFlashCardsFromSet,
    getFlashcard,
    getAllFlashCards
} = require("../controllers/flashcard");
const auth = require("../middlewares/auth");

router.post(
    "/createFlashcardSet",
    auth,
    [
        body("set_name").notEmpty().withMessage("Set name is required"),
        body("description").optional().isString().withMessage("Description must be a string"),
    ],
    createFlashcardSet
);

router.post(
    "/createFlashcard",
    auth,
    [
        body("question").notEmpty().withMessage("Question is required"),
        body("answer").notEmpty().withMessage("Answer is required"),
        body("question_type")
            .isInt({ min: 0, max: 2 })
            .withMessage("Invalid question type, must be 0 (MCQ), 1 (True/False), or 2 (Text)"),
        body("options")
            .optional()
            .isArray()
            .withMessage("Options should be an array"),
        body("options.*.option_text")
            .notEmpty()
            .withMessage("Option text is required"),
        body("options.*.is_correct")
            .isBoolean()
            .withMessage("is_correct must be a boolean value"),
        body("set_id").notEmpty().withMessage("Set ID is required"),
    ],
    createFlashcard
);

router.get("/flashcardSets", auth, getAllSets);

router.get("/flashcards/set/:set_id", auth, getAllFlashCardsFromSet);

router.get("/flashcard/:flashcard_id", auth, getFlashcard);

router.get("/flashcardsall", auth, getAllFlashCards);

module.exports = router;
