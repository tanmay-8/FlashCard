import React, { useEffect } from "react";
import FlashCardSets from "../components/FlashCardSets";

const Home = () => {
    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            navigate("/login");
        }
    }, []);

    return (
        <div className="p-8 py-10 mx-auto">
            <FlashCardSets />
        </div>
    );
};

export default Home;
