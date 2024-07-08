import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import axios from "axios";
import defaultImg from "../assets/defaultImg.jpeg";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineAttachFile } from "react-icons/md";
import { GoSmiley } from "react-icons/go";
import { IoMicOutline, IoMenu } from "react-icons/io5";
import Sidebar from "./Sidebar";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function Home() {
    const [currname, setCurrName] = useState();
    const profileRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [errorMessages, setErrorMessages] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const api = import.meta.env.VITE_API;
    const chatApi = import.meta.env.VITE_ChatApi;

    useEffect(() => {
        setLoading(true);
        axios.get(api)
            .then(async (response) => {
                const usersData = response.data.data.data;

                const usersWithLastMessage = await Promise.all(usersData.map(async user => {
                    try {
                        const messagesResponse = await axios.get(`${chatApi}?chat_id=${user.id}`);
                        const messages = messagesResponse.data.data;
                        const lastMessage = messages.length > 0 ? messages[messages.length - 1].message : 'No messages';
                        return { ...user, lastMessage };
                    } catch (error) {
                        return { ...user, lastMessage: 'Error loading message' };
                    }
                }));

                setUsers(usersWithLastMessage);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [api, chatApi]);

    useEffect(() => {
        if (profileRef.current) {
            profileRef.current.scrollIntoView({ behavior: 'smooth' });
        }

    }, []);


    const handleUserClick = (user) => {
        setCurrName(user.creator.name);
        fetchMessages(user.id);
        setIsChatOpen(true);
    };

    const fetchMessages = (userId) => {
        setLoadingMessages(true);
        axios.get(`${chatApi}?chat_id=${userId}`)
            .then(response => {
                setMessages(response.data.data);
                setLoadingMessages(false);
            })
            .catch(error => {
                setErrorMessages(error);
                setLoadingMessages(false);
            });
    };

    const formatTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    };

    const groupMessagesByDate = (messages) => {
        return messages.reduce((groups, message) => {
            const date = message.created_at.split('T')[0];
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
            return groups;
        }, {});
    };


    const filteredUsers = users.filter(user =>
        user.creator.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <div className='h-[100vh] w-[100%] bg-gray-900 flex flex-col lg:flex-row text-white bg-opacity-95'>
            <div className={`fixed lg:relative flex flex-col lg:w-[30%] w-full min-h-screen lg:min-h-0 bg-gray-800 overflow-auto overflow-x-hidden scrollbar transition-transform ${isChatOpen ? 'hidden' : 'block'} lg:block`}>
                <div className="flex p-2 gap-4">
                    <IoMenu className="w-6 h-6 cursor-pointer" onClick={toggleSidebar} />
                    <input
                        type="text"
                        placeholder="Search"
                        className="outline-none bg-gray-700 w-full px-2 py-1 rounded-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {isSidebarOpen && <Sidebar handleClose={toggleSidebar} />}

                {loading ? (
                    <p className="flex self-center justify-center">Loading Chats...</p>
                ) : error ? (
                    <p>Error: {error.message}</p>
                ) : (
                    <div className="flex flex-col gap-4 p-4">
                        {filteredUsers.map((user, idx) => (
                            <div key={idx} onClick={() => handleUserClick(user)} className="cursor-pointer">
                                {user.creator.name && <div className="flex items-center gap-4">
                                    <img src={defaultImg} alt="User DP" className="w-14 h-14 rounded-full" />
                                    <div className="flex-1">
                                        <div className="flex justify-between gap-2">
                                            <h3 className="font-bold">{user.creator.name}</h3>
                                            <p className="text-sm text-gray-400">{formatTime(user.creator.created_at)}</p>
                                        </div>
                                        <p className="text-sm text-gray-200 truncate ">{user.lastMessage}</p>
                                    </div>
                                </div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={`flex lg:w-[70%] lg:relative flex-col min-h-screen bg-gray-900 ${isChatOpen ? 'block' : 'hidden'}`}>
                <div className="fixed top-0 w-full lg:w-[70%] bg-gray-800 flex justify-between p-2 z-10">
                    <div className="flex gap-2">
                        <button onClick={toggleChat} className="lg:hidden"><IoMdArrowRoundBack /></button>
                        <p className="uppercase font-semibold">{currname}</p>
                    </div>
                    <BsThreeDotsVertical />
                </div>
                <div className="flex-1 overflow-y-auto p-4 mt-16 mb-16 scrollbar">
                    {loadingMessages ? (
                        <p>Loading messages...</p>
                    ) : errorMessages ? (
                        <p>Error loading messages: {errorMessages.message}</p>
                    ) : (
                        messages.length === 0 ? (
                            <div className="flex justify-center items-center h-full">
                                <p className="font-semibold rounded-full self-center  w-fit px-2 bg-white bg-opacity-10 text-sm">
                                    Select a chat to start messaging</p>
                            </div>
                        ) : (
                            Object.entries(groupMessagesByDate(messages)).map(([date, messages]) => (
                                <div key={date} className="mb-4">
                                    <div className="sticky top-0 text-center text-gray-400 flex justify-center items-center py-1"><p className="bg-gray-800 w-fit px-2 py-1 rounded-full">{formatDate(date)}</p></div>
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`p-2 mb-4 w-fit rounded-lg flex ${message.sender.name === "BeyondChat" ? 'bg-blue-500 text-white self-end' : 'bg-white bg-opacity-10 text-black self-start'}`}
                                        >
                                            <div className="flex flex-col">
                                                <p className={`${message.sender.name === "BeyondChat" ? "text-white font-bold " : "text-gray-400"}`}>{message.sender.name}</p>
                                                <div className="flex justify-between items-center gap-8 ">
                                                    <p className="text-white">{message.message}</p>
                                                    <p className={`text-xs items-center text-white`}>{formatTime(message.created_at)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))

                        )
                    )}
                </div>
                <div className="fixed bottom-0 w-full lg:w-[70%] bg-gray-800 flex p-2 items-center z-10">
                    <MdOutlineAttachFile />
                    <input type="text" placeholder="Write a message..." className="text-sm outline-none w-full bg-gray-800 px-4" />
                    <div className="flex gap-2">
                        <GoSmiley />
                        <IoMicOutline />
                    </div>
                </div>
            </div>
        </div>
    );
}
