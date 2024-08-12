import React, { useEffect } from "react";
import FlashCardSets from "../components/FlashCardSets";

const Home = () => {
    const [isLogin, setIsLogin] = useState(
        localStorage.getItem("token") ? true : false
    );

    useEffect(() => {
        setIsLogin(localStorage.getItem("token") ? true : false);

        if (!isLogin) {
            window.location.href = "/login";
        }
    }, []);

    return (
        <div className="p-8 py-10 mx-auto">
            <FlashCardSets />
        </div>
    );
};

export default Home;
