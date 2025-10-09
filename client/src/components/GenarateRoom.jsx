import { useState, useEffect } from 'react';
import { handleError, handleSuccess } from './Alertmessage';

export default function DevChatHomePage() {
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [generatedRoomId, setGeneratedRoomId] = useState('');
    const [joinRoomId, setJoinRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const [showGeneratedId, setShowGeneratedId] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [loder,setloder]=useState(false)

    // Create floating particles
    useEffect(() => {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'fixed w-1 h-1 bg-purple-400 rounded-full pointer-events-none z-0';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = window.innerHeight + 'px';
            particle.style.animation = 'particleFloat 8s linear forwards';
            particle.style.opacity = '0.6';

            document.body.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 8000);
        };

        const interval = setInterval(createParticle, 3000);

        // Add particle animation keyframes
        const style = document.createElement('style');
        style.textContent = `
      @keyframes particleFloat {
        to {
          transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
          opacity: 0;
        }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .float-animation {
        animation: float 3s ease-in-out infinite;
      }
    `;
        document.head.appendChild(style);

        return () => {
            clearInterval(interval);
            if (style.parentNode) {
                style.remove();
            }
        };
    }, []);

    const generateRoomId = () => {
        const roomId = Math.random().toString(36).substr(2, 8).toUpperCase();
        setGeneratedRoomId(roomId);
        setShowGeneratedId(true);

        console.log('Generated room:', {
            id: roomId,
            name: roomName || 'Untitled Room',
            created: new Date().toISOString()
        });
    };

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(generatedRoomId);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            alert(`Room ID: ${generatedRoomId}`);
        }
    };

    const joinRoom = async() => {
        if (!joinRoomId.trim()) {
            alert('Please enter a room ID');
            return;
        }
        setloder(true)
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/v1/roomwork/findroom`
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({RoomId: joinRoomId })
        })
        const data = await res.json()
        console.log(data)
        if(!data.status){
            setloder(false)
            return handleError("Not found any room.")
        }
        setloder(false)
        closeJoinModal();
    };

    const closeGenerateModal = async () => {
        setloder(true)
        console.log(generatedRoomId)
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/v1/roomwork/addroom`
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ generatedRoomId: generatedRoomId })
        })
        const data = await res.json()
        console.log(data)
        setloder(false)
        setGeneratedRoomId('');
        setShowGenerateModal(false);
        setShowGeneratedId(false);
        setRoomName('');
        handleSuccess("Room is created")
    };

    const closeJoinModal = () => {
        setShowJoinModal(false);
        setJoinRoomId('');
        setUserName('');
    };

    const handleKeyPress = (e, action) => {
        if (e.key === 'Enter') {
            action();
        }
    };

    const handleModalClick = (e) => {
        if (e.target === e.currentTarget) {
            if (showGenerateModal) closeGenerateModal();
            if (showJoinModal) closeJoinModal();
        }
    };

    return (
        <>
            <style jsx global>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          overflow-x: hidden;
        }
      `}</style>

            <div className="min-h-screen relative text-white">
                {/* Background Decoration */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%), 
                              radial-gradient(circle at 80% 80%, rgba(79, 70, 229, 0.3) 0%, transparent 50%)`
                    }}
                />

                <div className="flex flex-col items-center justify-center min-h-screen p-5 relative z-10">
                    {/* Logo Section */}
                    <div className="text-center mb-15 relative z-20">
                        <div
                            className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center text-3xl font-bold float-animation"
                            style={{
                                background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
                            }}
                        >
                            💬
                        </div>
                        <h1
                            className="text-4xl md:text-5xl font-bold mb-3"
                            style={{
                                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            DevChat
                        </h1>
                        <p className="text-lg text-white/70 font-light">Connect, Code, Collaborate</p>
                    </div>

                    {/* Options Container */}
                    <div className="flex flex-col gap-5 w-full max-w-md relative z-20">
                        {/* Generate Room Option */}
                        <div
                            onClick={() => setShowGenerateModal(true)}
                            className="bg-white/5 border border-purple-400/30 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 backdrop-blur-md relative overflow-hidden hover:-translate-y-1 hover:border-purple-400/60 group"
                            style={{
                                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent -translate-x-full transition-transform duration-500 group-hover:translate-x-full" />
                            <div
                                className="w-15 h-15 mx-auto mb-5 rounded-2xl flex items-center justify-center text-2xl"
                                style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}
                            >
                                🆕
                            </div>
                            <h2 className="text-xl font-semibold mb-3 text-white">Generate Room ID</h2>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Create a new chat room and get a unique room ID to share with your team
                            </p>
                        </div>

                        {/* Join Room Option */}
                        <div
                            onClick={() => setShowJoinModal(true)}
                            className="bg-white/5 border border-purple-400/30 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 backdrop-blur-md relative overflow-hidden hover:-translate-y-1 hover:border-purple-400/60 group"
                            style={{
                                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent -translate-x-full transition-transform duration-500 group-hover:translate-x-full" />
                            <div
                                className="w-15 h-15 mx-auto mb-5 rounded-2xl flex items-center justify-center text-2xl"
                                style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}
                            >
                                🚪
                            </div>
                            <h2 className="text-xl font-semibold mb-3 text-white">Join Room</h2>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Enter an existing room ID to join an ongoing conversation
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-8 text-center text-white/50 text-sm">
                        <p>&copy; 2025 DevChat. Building connections, one conversation at a time.</p>
                    </div>
                </div>

                {/* Generate Room Modal */}
                {showGenerateModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={handleModalClick}>
                        <div
                            className="border border-purple-400/30 rounded-2xl p-10 w-11/12 max-w-md text-center"
                            style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
                        >
                            {!showGeneratedId ? (
                                <>
                                    <h3 className="text-2xl mb-5 text-white">Generate New Room</h3>
                                    <div className="mb-5 text-left">
                                        <label className="block mb-2 text-white/90 font-medium">
                                            Room Name (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={roomName}
                                            onChange={(e) => setRoomName(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, generateRoomId)}
                                            placeholder="e.g., Frontend Team Discussion"
                                            className="w-full p-4 border border-purple-400/30 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-400/10 transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-4 mt-8">
                                        <button
                                            onClick={generateRoomId}
                                            className="flex-1 py-4 px-8 rounded-xl text-white font-semibold transition-all hover:-translate-y-1"
                                            style={{
                                                background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                                                boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)'
                                            }}
                                        >
                                            Generate ID
                                        </button>
                                        <button
                                            onClick={closeGenerateModal}
                                            className="flex-1 py-4 px-8 rounded-xl text-white font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-2xl mb-5 text-white">Room Created!</h3>
                                    <p className="mb-5 text-white/80">Your room has been created! Share this ID with others:</p>
                                    <div className="bg-purple-400/10 border border-purple-400/30 rounded-xl p-4 mb-6 font-mono text-lg tracking-widest text-purple-300 text-center">
                                        {generatedRoomId}
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={copyRoomId}
                                            className={`flex-1 py-4 px-8 rounded-xl text-white font-semibold transition-all hover:-translate-y-1 ${copySuccess ? 'bg-green-600' : ''
                                                }`}
                                            style={!copySuccess ? {
                                                background: 'linear-gradient(135deg, #8b5cf6, #a855f7)'
                                            } : {}}
                                        >
                                            {copySuccess ? 'Copied!' : 'Copy ID'}
                                        </button>
                                        <button
                                            onClick={closeGenerateModal}
                                            className="flex-1 py-4 px-8 rounded-xl text-white font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                                        >
                                            {loder?<div className='loder'></div>:'Done'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Join Room Modal */}
                {showJoinModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={handleModalClick}>
                        <div
                            className="border border-purple-400/30 rounded-2xl p-10 w-11/12 max-w-md text-center"
                            style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
                        >
                            <h3 className="text-2xl mb-8 text-white">Join Existing Room</h3>
                            <div className="mb-5 text-left">
                                <label className="block mb-2 text-white/90 font-medium">
                                    Room ID
                                </label>
                                <input
                                    type="text"
                                    value={joinRoomId}
                                    onChange={(e) => setJoinRoomId(e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, joinRoom)}
                                    placeholder="Enter room ID"
                                    className="w-full p-4 border border-purple-400/30 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-400/10 transition-all"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={joinRoom}
                                    className="flex-1 py-4 px-8 rounded-xl text-white font-semibold transition-all hover:-translate-y-1"
                                    style={{
                                        background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                                        boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)'
                                    }}
                                >
                                    {loder?<div className='loder'></div>:'Join Room'}
                                </button>
                                <button
                                    onClick={closeJoinModal}
                                    className="flex-1 py-4 px-8 rounded-xl text-white font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}