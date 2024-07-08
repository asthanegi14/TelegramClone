import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

export default function ConfirmOTP() {
    const location = useLocation();
    const history = useNavigate();
    const actualOtp = location.state.otp;
    const mailToReset = location.state.mail;
    const [otpToVerify, setOtpToVerify] = useState({ otp1: '', otp2: '', otp3: '', otp4: '' });
    const otp1Ref = useRef(null);
    const otp2Ref = useRef(null);
    const otp3Ref = useRef(null);
    const otp4Ref = useRef(null);

    const handleInputs = (event, nextRef) => {
        const { name, value } = event.target;

        if (value.length <= 1) {
            setOtpToVerify({ ...otpToVerify, [name]: value });

            if (value) {
                nextRef?.current?.focus();
            }
        }
    };

    const verify = () => {
        const userOtp = Object.values(otpToVerify).join('');

        if (actualOtp === userOtp) {
            history("/changePassword", { state: { mail: mailToReset } });

        } else {
            toast.error("Wrong OTP");
        }
    };

    return (
        <div className="sm:p-40 px-6 py-40 flex items-center justify-center">
            <Toaster />
            <div className="bg-gray-800 border-4 border-orange-800 opacity-[0.8] p-10 items-center justify-center flex flex-col rounded-3xl">
                <h1 className="text-4xl text-center font-bold font-serif p-4">Confirm OTP</h1>
                <p className="text-sm pb-4">Enter your 4 digit OTP</p>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row justify-between gap-4">
                        <input
                            className="bg-[#bdb5b5] p-2 w-10 text-center rounded placeholder-[#242424] text-[#242424]"
                            type="text"
                            name="otp1"
                            ref={otp1Ref}
                            value={otpToVerify.otp1}
                            onChange={(e) => handleInputs(e, otp2Ref)}
                            maxLength="1"
                            autoFocus
                        />

                        <input
                            className="bg-[#bdb5b5] p-2 w-10 text-center rounded placeholder-[#242424] text-[#242424]"
                            type="text"
                            name="otp2"
                            ref={otp2Ref}
                            value={otpToVerify.otp2}
                            onChange={(e) => handleInputs(e, otp3Ref)}
                            maxLength="1"
                        />

                        <input
                            className="bg-[#bdb5b5] p-2 w-10 text-center rounded placeholder-[#242424] text-[#242424]"
                            type="text"
                            name="otp3"
                            ref={otp3Ref}
                            value={otpToVerify.otp3}
                            onChange={(e) => handleInputs(e, otp4Ref)}
                            maxLength="1"
                        />

                        <input
                            className="bg-[#bdb5b5] p-2 w-10 text-center rounded placeholder-[#242424] text-[#242424]"
                            type="text"
                            name="otp4"
                            ref={otp4Ref}
                            value={otpToVerify.otp4}
                            onChange={(e) => handleInputs(e, null)}
                            maxLength="1"
                        />
                    </div>
                    <button className="bg-orange-800 py-1 rounded hover:scale-105 duration-300 hover:bg-orange-700" onClick={verify}>Confirm OTP</button>
                </div>
                <p className="text-sm pt-6">Didn't receive the OTP? <Link to={'/reset'} className="text-red-900 cursor-pointer hover:scale-115 duration-300 font-bold">Re-send OTP</Link></p>
            </div>
        </div>
    );
}
