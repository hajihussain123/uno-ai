import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useLobbyStore } from "../store/lobbyStore";
import Button from "../components/Button";

export default function LobbyPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const username = useUserStore((state) => state.username);
  const players = useLobbyStore((state) => state.players);

  const handleStartGame = () => {
    navigate(`/game/${roomCode}`, { replace: true });
  };

  const handleBack = () => {
    navigate("/home", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-slate-950 shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            UNO AI - Lobby
          </h1>
          <Button onClick={handleBack} variant="secondary" size="sm">
            Back to Home
          </Button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lobby Info Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">
              Lobby Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Room Code
                </p>
                <p className="text-2xl font-mono text-blue-400 font-bold mt-1">
                  {roomCode}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Players
                </p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {players.length}/4
                </p>
              </div>
              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Status
                </p>
                <p className="text-sm text-yellow-400 mt-2">
                  {players.length === 0
                    ? "Waiting for players..."
                    : "Ready to start!"}
                </p>
              </div>
            </div>
          </div>

          {/* Players List Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">
              Players ({players.length}/4)
            </h2>
            <div className="space-y-3">
              {/* Current User */}
              <div className="bg-slate-700 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-white font-semibold">{username} (You)</p>
                <p className="text-xs text-gray-400 mt-1">Host</p>
              </div>

              {/* Other Players */}
              {players.length === 0
                ? (
                  <div className="text-gray-400 text-center py-8">
                    <p className="text-sm">No other players yet</p>
                    <p className="text-xs mt-2">
                      Share the room code to invite friends
                    </p>
                  </div>
                )
                : (
                  players.map((player) => (
                    <div
                      key={player.id}
                      className="bg-slate-700 rounded-lg p-4"
                    >
                      <p className="text-white font-semibold">
                        {player.username}
                      </p>
                    </div>
                  ))
                )}
            </div>
          </div>
        </div>

        {/* Start Game Button */}
        <div className="mt-12">
          <Button
            onClick={handleStartGame}
            disabled={players.length < 1}
            variant="success"
            size="lg"
            fullWidth
          >
            {players.length === 0 ? "Waiting for players..." : "Start Game"}
          </Button>
        </div>
      </div>
    </div>
  );
}
