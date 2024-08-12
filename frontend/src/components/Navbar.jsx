import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const [role, setRole] = useState(localStorage.getItem("role"));

    useEffect(() => {
        setRole(localStorage.getItem("role"));
    }, [role]);

    if(!role) {
        return <div></div>
    }
    return (
        <nav className="shadow-sm p-4 md:px-16 px-8 bg-dark-bg-sec">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-gray-100 font-bold text-lg cursor-pointer">
                    FlashLearn.io
                </div>
                <div className="hidden md:flex space-x-12">
                    <Link
                        to="/"
                        className="text-gray-100 hover:text-white transtion-all hover:scale-105 cursor-pointer"
                    >
                        Home
                    </Link>
                    {role === "admin" && (
                        <Link
                            to="/admin"
                            className="text-gray-100 hover:text-white transtion-all hover:scale-105 cursor-pointer"
                        >
                            Admin Panel
                        </Link>
                    )}
                    <div
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/login";
                        }}
                        className="text-gray-100 hover:text-white transtion-all hover:scale-105 cursor-pointer"
                    >
                        Logout
                    </div>
                </div>
                <div className="md:hidden">
                    <button
                        onClick={toggleMenu}
                        className="text-gray-100 focus:outline-none"
                    >
                        {isOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>
            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden mt-2 space-y-2 transition-all">
                    <Link
                        to="/"
                        className="block text-gray-100 hover:bg-gray-700 p-2 rounded"
                        onClick={toggleMenu}
                    >
                        Home
                    </Link>
                    <Link
                        to="/admin"
                        className="block text-gray-100 hover:bg-gray-700 p-2 rounded"
                        onClick={toggleMenu}
                    >
                        Admin Panel
                    </Link>
                    <Link
                        to="/logout"
                        className="block text-gray-100 hover:bg-gray-700 p-2 rounded"
                        onClick={toggleMenu}
                    >
                        Logout
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
