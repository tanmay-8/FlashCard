import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FlashCards = () => {
    const params = useParams();

    const getFlashCards = async () => {
        const setId = params.id;
        if (!setId) {
            return;
        }
        try {
            const res = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/flashcard/flashcards/set/${setId}`,
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
                console.log(data.flashcards);
            } else {
                console.log("No flashcards found");
            }
        } catch {
            console.log("Error getting flashcards");
        }
    };
    useEffect(() => {
        getFlashCards();
    }, []);

    if (!params.id) {
        return <div></div>;
    }
    return <div>{/* <p>Flash Cards for set with id {setId}</p> */}</div>;
};

export default FlashCards;
