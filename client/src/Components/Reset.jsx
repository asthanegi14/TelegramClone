import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
import axios from "axios";

export default function Reset() {
    const history = useNavigate();
    const [email, setEmail] = useState("");

    async function generateOTP(e) {
        e.preventDefault();

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reset`, {
                email
            })
                .then(res => {
                    if (res.data == "Failed to send OTP") {
                        toast.error("Failed to send OTP");
                    } else if (res.data == "This Email is Not registered") {
                        toast.error("This Email is Not registered");
                    } else if (res.data.msg == "OTP sent successfully") {
                        history("/confirmOTP", { state: { otp: res.data.otp, mail: email } });
                    }
                })
                .catch(e => {
                    toast.error("Error while sending OTP", e);
                    console.log(e);
                });
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="sm:p-40 px-6 py-40 flex items-center justify-center">
            <Toaster />
            <div className="bg-white text-black border-4 opacity-90 p-10 items-center justify-center flex flex-col rounded-3xl gap-4">
                <h1 className="text-4xl text-center font-bold font-serif p-4">Reset Password</h1>
                <p className="text-sm pb-4 text-gray-400">Enter your email to receive a 4-digit OTP</p>
                <form className="flex flex-col gap-6">
                    <fieldset className="border border-gray-300 rounded-md">
                        <legend className="text-sm px-2 text-gray-400">Email</legend>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-2 placeholder-[#242424] text-[#242424] outline-none"
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                    </fieldset>
                    <button
                        className="bg-blue-500 py-2 rounded mt-4 hover:scale-105 duration-300 hover:bg-orange-700 text-white"
                        onClick={generateOTP}
                    >
                        Send OTP
                    </button>
                </form>
                <p className="text-sm text-gray-400 flex gap-2">Didn't receive the OTP?
                    <Link
                        to={'/reset'}
                        className="text-red-500 cursor-pointer hover:scale-115 duration-300 font-bold"
                        onClick={generateOTP}
                    >
                        Re-send OTP
                    </Link>
                </p>
                <p className="text-sm text-gray-400 flex gap-2">Go back to
                    <Link
                        to={'/login'}
                        className="text-red-500 cursor-pointer hover:scale-115 duration-300 font-bold"
                    >
                        Login page
                    </Link>
                </p>
                <p className="text-sm text-gray-400 flex gap-2">Don't have an account?
                    <Link
                        to={'/register'}
                        className="text-red-500 cursor-pointer hover:scale-115 duration-300 font-bold"
                    >
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
