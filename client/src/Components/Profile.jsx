import { useLocation } from "react-router-dom";
import defaultImg from "../assets/defaultImg.jpeg";

export default function Profile() {
    const location = useLocation();
    const address = location.state.address;
    const phone = location.state.phone;
    const name = location.state.username;
    const email = location.state.email;

    return (
        <div>
            <div className="flex items-center justify-center bg-gray-800 h-[100vh] w-[100%]">
                <div className="bg-gray-700 p-8 flex flex-col rounded-3xl gap-6 text-center w-[50%]">
                    <div className="flex text-white justify-center items-center gap-4">
                        <img src={defaultImg} alt="default" className="w-12 h-12 rounded-full" />
                        <p className="font-semibold uppercase">{name}</p>
                    </div>

                    <div className="flex flex-col text-left text-white gap-2">
                        <h2 className="text-blue-300 font-semibold ">Info</h2>
                        <div className="flex flex-col">
                            <p>{phone}</p>
                            <p className="text-xs">Mobile</p>
                        </div>

                        <div className="flex flex-col">
                            <p>{address}</p>
                            <p className="text-xs">Address</p>
                        </div>

                        <div className="flex flex-col">
                            <p>{email}</p>
                            <p className="text-xs">Email</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}