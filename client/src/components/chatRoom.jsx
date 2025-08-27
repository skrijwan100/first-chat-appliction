import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreHorizontal, Search, Smile, Paperclip, Users } from 'lucide-react';
import { io } from 'socket.io-client'

const ChatRoom = () => {
     const socket = useRef(io("http://localhost:5000")).current;
    const [Umessage, setUMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
        socket.on('recivemessage', (data) => {
            console.log(data)
             setMessages((prev) => [...prev, data]);
        });
        console.log(messages)
        return () => socket.off('recivemessage');
    }, []);

    const sendMessage = () => {
        if (Umessage.trim()) {
            const newMsg = {
                message: Umessage,
                isMe: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            socket.emit("usermessage", newMsg);
            console.log(newMsg)
            // setMessages((prev) => [...prev, newMsg]); // show immediately
            setUMessage(''); // ✅ reset string input
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-white font-semibold">DevChat Room</h2>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-200">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-200">
                            <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-200">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} group`}>
                            <div className={`flex max-w-xs lg:max-w-md space-x-3 ${msg.isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <div className={`${msg.isMe ? 'items-end' : 'items-start'} flex flex-col space-y-1`}>
                                    {!msg.isMe && (
                                        <span className="text-xs text-slate-400 font-medium px-1">random</span>
                                    )}
                                    <div className={`px-4 py-3 rounded-2xl ${msg.isMe
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                        : 'bg-white/10 backdrop-blur-sm text-white border border-white/10'
                                        } shadow-lg transform transition-all duration-200 hover:scale-105`}>
                                        <p className="text-sm leading-relaxed">{msg.message}</p>
                                    </div>
                                    <span className={`text-xs text-slate-500 px-1 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="bg-black/20 backdrop-blur-xl border-t border-white/10 p-4">
                    <div className="flex items-end space-x-4">
                        {/* <div className="flex space-x-2">
                            <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-200">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-200">
                                <Smile className="w-5 h-5" />
                            </button>
                        </div> */}

                        <div className="flex-1 relative">
                            <textarea
                                value={Umessage}
                                onChange={(e) => setUMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200 resize-none max-h-32"
                                rows={1}
                            />
                        </div>

                        <button
                            onClick={sendMessage}
                            className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl text-white transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg mb-[6px]"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;