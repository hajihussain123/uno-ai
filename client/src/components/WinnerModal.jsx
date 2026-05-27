import Button from "./Button";

export default function WinnerModal({ winner, roomCode, onExitGame }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl shadow-2xl p-12 text-center border-2 border-yellow-400 max-w-md w-full mx-4">
        <div className="text-6xl mb-6">🎉</div>

        <h1 className="text-4xl font-bold text-yellow-400 mb-4">
          Game Over!
        </h1>

        <p className="text-2xl font-semibold text-white mb-2">
          Winner
        </p>

        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400 mb-8">
          {winner}
        </p>

        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            Room Code
          </p>
          <p className="text-gray-200 font-mono text-lg mt-1">
            {roomCode}
          </p>
        </div>

        <Button
          onClick={onExitGame}
          variant="success"
          size="lg"
          className="w-full"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}
