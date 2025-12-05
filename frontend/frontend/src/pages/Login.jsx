// src/pages/Login.jsx
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("login/", { username, password });
            
            // 1. Save Token AND Username
            localStorage.setItem("ACCESS_TOKEN", res.data.token);
            localStorage.setItem("USERNAME", res.data.user.username);
            
            navigate("/");
        } catch (error) {
            alert("Invalid credentials!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4">
            <div className="animate-slide-up w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        NoteGenius
                    </h1>
                    <p className="text-gray-500 mt-2">Welcome back, creator!</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transform active:scale-95 transition duration-200 shadow-lg"
                        type="submit" 
                        disabled={loading}
                    >
                        {loading ? "Unlocking..." : "Login"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        New here?{" "}
                        <a href="/register" className="text-blue-600 font-bold hover:underline">
                            Create an account
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;