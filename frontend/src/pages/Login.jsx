import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token") !== null) {
            navigate("/");
        }
    });
    const login = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/user/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await res.json();
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);

                window.location.reload();
            } else {
                alert(data.errors[0].msg);
            }
        } catch (err) {
            console.log(err);
            alert("Error logging in");
        }
    };

    const signup = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/user/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await res.json();
            if (data.msg) {
                alert(data.msg);
                setIsLogin(true);
            } else {
                alert("Error signing up");
            }
        } catch (err) {
            console.log(err);
            alert("Error signing up");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-dark-bg text-gray-300">
            <div className="w-full max-w-md p-8 space-y-6 bg-dark-bg-sec rounded-md shadow-lg">
                <h2 className="text-2xl font-bold text-center">
                    {isLogin ? "Login" : "Sign Up"}
                </h2>
                <form
                    className="space-y-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (isLogin) {
                            login();
                        } else {
                            signup();
                        }
                    }}
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 mt-1 text-black rounded-md outline-none"
                            placeholder="Enter your email"
                            required={true}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium outline-none"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 mt-1 text-black rounded-md outline-none"
                            placeholder="Enter your password"
                            required={true}
                            minLength={8}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>
                <div className="text-center mt-2">
                    <button
                        onClick={toggleForm}
                        className="font-medium text-blue-400 hover:text-blue-500"
                    >
                        {isLogin
                            ? "Don't have an account? Sign Up"
                            : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
