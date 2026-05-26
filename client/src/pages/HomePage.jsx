import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import Button from "../components/Button";
import { emit, off, on } from "../socket/socketService";

export default function HomePage() {
  const navigate = useNavigate();
  const username = useUserStore((state) => state.username);
  const isInitialized = useUserStore((state) => state.isInitialized);
  const setIsConnected = useUserStore((state) => state.setIsConnected);
  const clearUsername = useUserStore((state) => state.clearUsername);

  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  // Initialize from storage and test socket connection
  useEffect(() => {
    if (!isInitialized) {
      useUserStore.getState().initializeFromStorage();
    }
  }, [isInitialized]);

  useEffect(() => {
    if (!username) {
      navigate("/", { replace: true });
      return;
    }

    // Test socket connection with ping
    const handlePong = (data) => {
      console.log("Received pong:", data);
      setConnectionStatus("Connected ✓");
      setIsConnected(true);
    };

    on("pong", handlePong);

    // Send ping to test connection
    setTimeout(() => {
      emit("ping", { message: "Hello Server" });
    }, 500);

    return () => {
      off("pong", handlePong);
    };
  }, [username, navigate, setIsConnected]);

  const handleLogout = () => {
    clearUsername();
    navigate("/", { replace: true });
  };

  const handleHostGame = () => {
    // TODO: Implement room creation logic
    alert("Room creation coming soon!");
  };

  const handleJoinGame = () => {
    // TODO: Implement join room logic
    alert("Join room coming soon!");
  };

  if (!isInitialized) {
    return <div className="min-h-screen bg-slate-900" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-slate-950 shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            UNO AI
          </h1>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-white font-semibold">{username}</p>
              <p className="text-sm text-green-400">{connectionStatus}</p>
            </div>
            <Button onClick={handleLogout} variant="danger" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Welcome */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome back, <span className="text-blue-400">{username}</span>!
          </h2>
          <p className="text-gray-400 text-lg">
            Choose an option to get started
          </p>
        </div>

        {/* Game Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Host Game Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition border border-slate-700 hover:border-blue-500">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto">
                <span className="text-3xl">🎮</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-center">
              Host Game
            </h3>
            <p className="text-gray-400 mb-6 text-center">
              Create a new game room and invite others to join you
            </p>
            <Button
              onClick={handleHostGame}
              variant="primary"
              size="lg"
              fullWidth
            >
              Create Room
            </Button>
          </div>

          {/* Join Game Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition border border-slate-700 hover:border-purple-500">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mx-auto">
                <span className="text-3xl">👥</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-center">
              Join Game
            </h3>
            <p className="text-gray-400 mb-6 text-center">
              Enter a room code to join an existing game
            </p>
            <Button
              onClick={handleJoinGame}
              variant="secondary"
              size="lg"
              fullWidth
            >
              Join Room
            </Button>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-16 bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-md mx-auto">
          <h3 className="text-lg font-bold text-white mb-4">
            Connection Status
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-green-400 font-semibold">
                {connectionStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Username:</span>
              <span className="text-blue-400 font-semibold">{username}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
