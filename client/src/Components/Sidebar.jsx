import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import defaultImg from "../assets/defaultImg.jpeg";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";

export default function Sidebar({ handleClose }) {
    const location = useLocation();
    const history = useNavigate();
    const name = location.state ? location.state.username : null;
    const email = location.state ? location.state.email : null;
    const phone = localStorage.getItem("phone");
    const token = localStorage.getItem("token");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(true);
    }, []);

    async function profile(e) {
        e.preventDefault();

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
                email
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.data === "Not signed in yet") {
                history("/profile", { state: { msg: "You have not signed in yet" } });
            } else if (res.data.msg === "logged in") {
                history("/profile", { state: { email: email, username: name, address: res.data.content.address, site: res.data.content.site, phone: res.data.content.phone } });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }

    return (
        <div className={`fixed top-0 left-0 flex flex-col bg-gray-800 items-start sm:w-[30%] w-full h-full gap-4 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col w-full h-fit bg-gray-700 py-4 px-2">
                <div className="w-full items-center flex justify-between p-2">
                    <img src={defaultImg} alt="profile" className="w-12 h-12 rounded-full" />
                    <RxCross2 className="w-6 h-6 cursor-pointer" onClick={handleClose} />
                </div>
                <h2 className="w-full text-xl font-bold uppercase px-2">{name}</h2>
                <p className="w-full text-sm text-gray-300 font-bold uppercase px-2">{phone}</p>
            </div>
            <div className="flex p-2 gap-4 cursor-pointer" onClick={profile}>
                <CgProfile className="w-6 h-6" />
                <h2 className="font-semibold">My Profile</h2>
            </div>
        </div>
    );
}
