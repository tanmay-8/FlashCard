import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, Trash2 } from "lucide-react";

const Admin = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchFlashcards = async () => {
        // Fetch flashcards from the backend
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/flashcard/flashcardsall`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                    },
                }
            );
            const data = await res.json();
            if (data.flashcards) {
                setFlashcards(data.flashcards);
            } else {
                console.log("No flashcards found");
            }
        } catch (error) {
            console.error("Failed to fetch flashcards:", error);
        }
    };

    useEffect(() => {
        fetchFlashcards();
    }, []);

    const handleAddFlashcard = async () => {
        // Add a new flashcard
        if (!question || !answer) return;
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/flashcards`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ question, answer }),
                }
            );
            if (res.ok) {
                fetchFlashcards();
                setQuestion("");
                setAnswer("");
            }
        } catch (error) {
            console.error("Failed to add flashcard:", error);
        }
    };

    const handleEditFlashcard = async () => {
        // Update an existing flashcard
        if (!question || !answer || !editingId) return;
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/flashcards/${editingId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ question, answer }),
                }
            );
            if (res.ok) {
                fetchFlashcards();
                setQuestion("");
                setAnswer("");
                setIsEditing(false);
                setEditingId(null);
            }
        } catch (error) {
            console.error("Failed to update flashcard:", error);
        }
    };

    const handleDeleteFlashcard = async (id) => {
        // Delete a flashcard
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/flashcards/${id}`,
                {
                    method: "DELETE",
                }
            );
            if (res.ok) {
                fetchFlashcards();
            }
        } catch (error) {
            console.error("Failed to delete flashcard:", error);
        }
    };

    const startEdit = (flashcard) => {
        setQuestion(flashcard.question);
        setAnswer(flashcard.answer);
        setIsEditing(true);
        setEditingId(flashcard.id);
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white p-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="bg-dark-bg-sec p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">
                    {isEditing ? "Edit Flashcard" : "Add Flashcard"}
                </h2>
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Question</label>
                    <input
                        type="text"
                        className="w-full p-2 rounded bg-gray-800 text-white"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Answer</label>
                    <input
                        type="text"
                        className="w-full p-2 rounded bg-gray-800 text-white"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                </div>
                <button
                    onClick={
                        isEditing ? handleEditFlashcard : handleAddFlashcard
                    }
                    className="bg-primary px-4 py-2 rounded-lg"
                >
                    {isEditing ? "Update" : "Add"} Flashcard
                </button>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Flashcards</h2>
                <div className="space-y-4">
                    {flashcards.map((flashcard) => (
                        <div
                            key={flashcard.id}
                            className="bg-dark-bg-sec p-4 rounded-lg shadow-lg flex justify-between items-center"
                        >
                            <div>
                                <p className="font-bold">
                                    {flashcard.question}
                                </p>
                                <p className="text-gray-400">
                                    {flashcard.answer}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => startEdit(flashcard)}>
                                    <Edit3 className="h-6 w-6 text-yellow-500" />
                                </button>
                                <button
                                    onClick={() =>
                                        handleDeleteFlashcard(flashcard.id)
                                    }
                                >
                                    <Trash2 className="h-6 w-6 text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Admin;
