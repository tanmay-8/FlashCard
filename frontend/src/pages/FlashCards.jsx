import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

const FlashCards = () => {
  const params = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const getFlashCards = async () => {
    const setId = params.id;
    if (!setId) {
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/flashcard/flashcards/set/${setId}`,
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
      console.log("Error getting flashcards:", error);
    }
  };

  useEffect(() => {
    getFlashCards();
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  if (!params.id || flashcards.length === 0) {
    return <div className="text-white text-center mt-10">Loading flashcards...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-bg text-white">
      <div
        className={`relative bg-dark-bg-sec p-8 rounded-lg shadow-lg w-full max-w-md cursor-pointer transform transition-transform duration-700 ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        onClick={handleFlip}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {isFlipped
              ? flashcards[currentIndex].answer
              : flashcards[currentIndex].question}
          </h2>
          <p className="text-sm text-gray-400">
            {isFlipped ? "Answer" : "Question"}
          </p>
        </div>
        <div className="absolute top-2 right-2">
          <RotateCcw className="h-6 w-6 text-gray-500" />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handlePrevious}
          className={`${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          } bg-gray-700 px-4 py-2 rounded-lg flex items-center`}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-6 w-6" />
          Previous
        </button>
        <button
          onClick={handleNext}
          className={`${
            currentIndex === flashcards.length - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          } bg-gray-700 px-4 py-2 rounded-lg flex items-center`}
          disabled={currentIndex === flashcards.length - 1}
        >
          Next
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default FlashCards;
