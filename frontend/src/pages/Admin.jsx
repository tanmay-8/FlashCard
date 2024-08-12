import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(
        localStorage.getItem("role") === "admin" ? true : false
    );

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role === "admin") {
            setIsAdmin(true);
        }
        if (role !== "admin") {
            navigate("/");
        }
    }, [isAdmin]);

    if (!isAdmin) {
        return <div></div>;
    }

    return <div></div>;
};

export default Admin;
