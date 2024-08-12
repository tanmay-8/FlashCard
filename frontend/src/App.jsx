import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import FlashCardSets from "./components/FlashCardSets";
import FlashCards from "./pages/FlashCards";

function App() {
    return (
        <div className="font-main bg-dark-bg min-h-[100vh]">
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/flashCards/:id" element={<FlashCards />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
