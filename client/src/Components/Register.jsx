import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import Logo from "../assets/teleIcon.png";

export default function Register() {
    const [username, setName] = useState("");
    const [pass, setPass] = useState("");
    const [cpass, setCPass] = useState("");
    const [mail, setMail] = useState("");
    const [pNo, setPNo] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    const history = useNavigate();

    async function submit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            if (pass !== cpass) {
                toast.error("Password and re-entered password don't match");
            } else {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/register`, {
                    email: mail,
                    username: username,
                    password: pass,
                    phone: pNo,
                    address: address,
                })
                    .then(res => {
                        console.log("res = " + JSON.stringify(res));

                        if (res.data === "email already exist") {
                            toast.error("User already exists");
                        } else if (res.data === "Username already exist, please try other username.") {
                            toast.error("Username already exists, please try another username.");
                        } else if (res.data === "registered successfully") {
                            toast.success("You have registered successfully, Go back to the login page");
                            // history("/");
                        }
                    })
                    .catch(e => {
                        toast.error("Wrong details", e);
                    });
            }
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
                <h1 className="text-4xl text-center font-bold font-serif uppercase">Register</h1>
                <p className="text-sm text-gray-600">Enter your details below to register yourself</p>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <fieldset className="border border-gray-300 rounded-md">
                        <legend className="text-sm px-2 text-gray-600">Username</legend>
                        <input type="text" name="username" className="w-full px-4 py-2 placeholder-[#242424] text-[#242424] outline-none" onChange={(e) => { setName(e.target.value) }} />
                    </fieldset>
                    <fieldset className="border border-gray-300 rounded-md">
                        <legend className="text-sm px-2 text-gray-600">Email</legend>
                        <input type="text" name="email" className="w-full px-4 py-2 placeholder-[#242424] text-[#242424] outline-none" onChange={(e) => { setMail(e.target.value) }} />
                    </fieldset>
                    <fieldset className="border border-gray-300 rounded-md">
                        <legend className="text-sm px-2 text-gray-600">Password</legend>
                        <input type="password" name="password" className="w-full px-4 py-2 placeholder-[#242424] text-[#242424] outline-none" onChange={(e) => { setPass(e.target.value) }} />
                    </fieldset>
                    <fieldset className="border border-gray-300 rounded-md">
                        <legend className="text-sm px-2 text-gray-600">Confirm Password</legend>
                        <input type="password" name="cPassword" className="w-full px-4 py-2 placeholder-[#242424] text-[#242424] outline-none" onChange={(e) => { setCPass(e.target.value) }} />
                    </fieldset>
                    <fieldset className="border border-gray-300 rounded-md">
                        <legend className="text-sm px-2 text-gray-600">Phone Number</legend>
                        <input type="text" name="phone" className="w-full px-4 py-2 placeholder-[#242424] text-[#242424] outline-none" onChange={(e) => { setPNo(e.target.value) }} />
                    </fieldset>
                    <fieldset className="border border-gray-300 rounded-md">
                        <legend className="text-sm px-2 text-gray-600">Address</legend>
                        <input type="text" name="address" className="w-full px-4 py-2 placeholder-[#242424] text-[#242424] outline-none" onChange={(e) => { setAddress(e.target.value) }} />
                    </fieldset>
                    <button
                        type="submit"
                        className={`bg-blue-500 py-2 rounded mt-4 hover:scale-105 duration-300 ${loading ? 'cursor-not-allowed' : 'hover:bg-blue-700'} text-white`}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Register"}
                    </button>
                </form>
                <p className="text-sm text-gray-600">Already have an account? <Link to={'/'} className="text-red-500 cursor-pointer hover:scale-115 duration-300 font-bold">Login here</Link></p>
            </div>
        </div>
    );
}
