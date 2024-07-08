import { Link, useLocation } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
import axios from "axios";

export default function ChangePassword() {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const location = useLocation();
    const mail = location.state.mail;

    async function update(e) {
        e.preventDefault();

        if (password != newPassword) {
            toast.error("Both passwrods are different");
        }
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/changePassword`, {
                mail, password
            })
                .then(res => {
                    if (res.data == "No user is registered with this email address") {
                        toast.error("No user is registered with this email address");
                    }
                    else if (res.data == "New Password can not be equal to previous password") {
                        toast.error("New Password can not be equal to previous password");
                    }
                    else {
                        toast.success("Password updated successfully");
                    }
                })
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="sm:p-40 px-6 py-40 flex items-center justify-center">
            <Toaster />
            <div className="bg-gray-800 border-4 border-orange-800 opacity-[0.8] p-10 items-center justify-center flex flex-col rounded-3xl">
                <h1 className="text-4xl text-center font-bold font-serif p-4">Change Password</h1>
                <p className="text-sm pb-4">Enter a new password</p>
                <form action="POST">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-between gap-4">
                            <label htmlFor="username">Password</label>
                            <input type="password" name="username" placeholder="Your Password" className="px-4 bg-slate-400 placeholder-[#242424] rounded-sm text-[#242424]" onChange={(e) => { setPassword(e.target.value) }} />
                        </div>
                        <div className="flex flex-row gap-4 justify-between">
                            <label htmlFor="password">Re-Enter</label>
                            <input type="password" name="password" placeholder="Re Enter Password" className="px-4 bg-slate-400 placeholder-[#242424] rounded-sm text-[#242424]" onChange={(e) => { setNewPassword(e.target.value) }} />
                        </div>
                        <button className="bg-orange-800 py-1 rounded hover:scale-105 duration-300 hover:bg-orange-700" onClick={update}>Update</button>
                    </div>
                </form>
                <p className="text-sm pt-2">Go back to <Link to={'/'} className="text-red-900 cursor-pointer hover:scale-115 duration-300 font-bold">Login Page </Link></p>
            </div>
        </div>
    )
}