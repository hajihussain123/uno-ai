import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useGameStore } from "../store/gameStore";
import Button from "../components/Button";

export default function GamePage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const username = useUserStore((state) => state.username);
  const gameState = useGameStore((state) => state.gameState);

  const handleBackToHome = () => {
    useGameStore.setState({ gameState: "waiting" });
    navigate("/home", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-slate-950 shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            UNO AI - Game
          </h1>
          <Button onClick={handleBackToHome} variant="danger" size="sm">
            Exit Game
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-12 text-center border border-slate-700 min-h-96 flex flex-col items-center justify-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Game In Progress
              </h2>
              <p className="text-gray-300 mb-6">Room: {roomCode}</p>
              <p className="text-gray-400 mb-8">
                Game State:{" "}
                <span className="text-blue-400 font-semibold">{gameState}</span>
              </p>
              <div className="text-center">
                <p className="text-xl text-yellow-400 font-semibold">🎮</p>
                <p className="text-gray-400 mt-4 text-lg">
                  Game logic coming soon...
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Game Info */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-6">Game Info</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Your Username
                </p>
                <p className="text-sm text-blue-400 font-semibold mt-1">
                  {username}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Room Code
                </p>
                <p className="text-lg font-mono text-green-400 font-bold mt-1">
                  {roomCode}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Game Status
                </p>
                <p className="text-sm text-yellow-400 font-semibold mt-2">
                  {gameState}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
