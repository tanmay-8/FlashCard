import React from "react";
import { useState, useEffect } from "react";
import SetCard from "./SetCard";
import { useNavigate } from "react-router-dom";

const FlashCardSets = () => {
    const [flashCardSets, setFlashCardSets] = useState([]);
    const navigate = useNavigate();

    const getFlashCardSets = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/flashcard/flashcardSets`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                    },
                }
            );
            const data = await res.json();
            if (data.sets) {
                setFlashCardSets(data.sets);
            } else {
                setFlashCardSets([]);
            }
        } catch {
            setFlashCardSets([]);
        }
    };

    useEffect(() => {
        getFlashCardSets();
    }, []);
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {flashCardSets.map((flashCardSet) => (
                    <SetCard
                        key={flashCardSet.set_id}
                        set={flashCardSet}
                        onclick={() => {
                            navigate(`/flashcards/${flashCardSet.set_id}`);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default FlashCardSets;
