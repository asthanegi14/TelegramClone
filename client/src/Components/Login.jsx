import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
import axios from "axios";
import Logo from "../assets/teleIcon.png";

export default function Login() {
    const history = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, { email, password })
                .then(res => {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('phone', res.data.phone);
                    console.log("res = " + JSON.stringify(res) + " phone = " + res.data.phone);

                    if (res.data.msg === "login successfully") {
                        console.log("login sucess");
                        history("/home", { state: { username: res.data.username, email: email } });
                    } else if (res.data === "this email is not registered") {
                        toast.error("This email is not registered");
                    } else if (res.data === "Wrong Password") {
                        toast.error("Wrong Password");
                    } else if (res.data === "Password can not be empty") {
                        toast.error("Password can not be empty");
                    }
                })
                .catch(e => {
                    toast.error("Wrong details");
                    console.log(e);
                });
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4 flex items-center justify-center">
            <Toaster />
            <div className="bg-white text-black border-4 opacity-90 p-10 items-center justify-center flex flex-col rounded-3xl gap-6">
                <img src={Logo} alt="logo" />
                <h1 className="text-4xl text-center font-bold font-serif uppercase">Login</h1>
                <p className="text-sm text-gray-600">Enter your username and password</p>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <fieldset className="border border-gray-300 rounded-md">
                        <legend className="text-sm px-2 text-gray-600">Email</legend>
                        <input type="text" name="email" className="w-full px-4 py-2 placeholder-[#242424] text-[#242424] outline-none" onChange={(e) => setEmail(e.target.value)} />
                    </fieldset>
                    <fieldset className="border border-gray-300 rounded-md">
                        <legend className="text-sm px-2 text-gray-600">Password</legend>
                        <input type="password" name="password" className="w-full px-4 py-2 placeholder-[#242424] text-[#242424] outline-none" onChange={(e) => setPass(e.target.value)} />
                    </fieldset>
                    <button
                        type="submit"
                        className={`bg-blue-500 py-2 rounded mt-4 hover:scale-105 duration-300 ${loading ? 'cursor-not-allowed' : 'hover:bg-blue-700'} text-white`}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>
                <p className="text-sm text-gray-600">Don't have an account? <Link to={'/register'} className="text-red-500 cursor-pointer hover:scale-115 duration-300 font-bold">Register here</Link></p>
                <p className="text-sm text-gray-600">Forgot password? <Link to={'/reset'} className="text-red-500 cursor-pointer hover:scale-115 duration-300 font-bold">Reset password</Link></p>
            </div>
        </div>
    );
}
