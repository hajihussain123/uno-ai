import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useGameStore } from "../store/gameStore";
import { useLobbyStore } from "../store/lobbyStore";
import Button from "../components/Button";
import WinnerModal from "../components/WinnerModal";
import { off, on } from "../socket/socketService";
import { emit as emitSocket } from "../socket/socketService";

export default function GamePage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const username = useUserStore((state) => state.username);

  const gameState = useGameStore((state) => state.gameState);
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
  const currentColor = useGameStore((state) => state.currentColor);
  const currentValue = useGameStore((state) => state.currentValue);
  const hand = useGameStore((state) => state.hand);
  const discardPile = useGameStore((state) => state.discardPile);
  const deck = useGameStore((state) => state.deck);
  const winner = useGameStore((state) => state.winner);

  const updateFromGameState = useGameStore((state) =>
    state.updateFromGameState
  );
  const resetGameStore = useGameStore((state) => state.reset);
  const resetLobbyStore = useLobbyStore((state) => state.reset);

  // Get current player name
  const currentPlayer = players[currentPlayerIndex];
  const isCurrentPlayerTurn = currentPlayer &&
    currentPlayer.username === username;
  const isGameFinished = winner !== null;

  // Check if player has playable cards
  const playableCards = hand.filter(
    (card) => card.color === currentColor || card.value === currentValue,
  );
  const hasPlayableCards = playableCards.length > 0;

  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Setup socket listeners on component mount
  useEffect(() => {
    const handleGameStateUpdated = (data) => {
      if (data.roomCode === roomCode && data.gameState) {
        updateFromGameState(data.gameState, username);
      }
    };

    const handleError = (data) => {
      if (data && data.roomCode === roomCode) {
        alert(data.error || "Error");
      }
    };

    on("gameStateUpdated", handleGameStateUpdated);
    on("error", handleError);

    return () => {
      off("gameStateUpdated", handleGameStateUpdated);
      off("error", handleError);
    };
  }, [roomCode, username, updateFromGameState]);

  const handleBackToHome = () => {
    resetGameStore();
    resetLobbyStore();
    navigate("/home", { replace: true });
  };

  const handleDrawCard = () => {
    if (!isCurrentPlayerTurn) {
      alert("Not your turn");
      return;
    }

    if (hasPlayableCards) {
      alert("You have playable cards. Play a card first.");
      return;
    }

    setIsDrawing(true);
    emitSocket("drawCard", { roomCode }, (response) => {
      setIsDrawing(false);
      if (!response?.success) {
        alert(response?.error || "Failed to draw card");
      }
    });
  };

  const getColorClass = (color) => {
    const colorMap = {
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-400",
    };
    return colorMap[color] || "bg-gray-500";
  };

  const renderCard = (card) => {
    const isSelected = selectedCardId === card.id;
    const isDisabled = !isCurrentPlayerTurn || isGameFinished;

    const handleClick = () => {
      if (isDisabled) return;
      setSelectedCardId((prev) => (prev === card.id ? null : card.id));
    };

    const handleDoubleClick = () => {
      if (isDisabled) {
        alert("Not your turn or game is finished");
        return;
      }

      // validate locally simple rule: same color or same number
      const playable = card.color === currentColor ||
        card.value === currentValue;
      if (!playable) {
        alert("Card not playable");
        return;
      }

      emitSocket("playCard", { roomCode, cardId: card.id });
      setSelectedCardId(null);
    };

    return (
      <div
        key={card.id}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={`w-16 h-24 rounded-lg ${
          getColorClass(card.color)
        } flex items-center justify-center text-white font-bold text-lg border-2 border-white transform transition ${
          isDisabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer " +
              (isSelected ? "-translate-y-2 shadow-2xl" : "")
        }`}
      >
        {card.value}
      </div>
    );
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
        {/* Game Status */}
        <div className="mb-8 text-center">
          <p className="text-gray-300 mb-2">Room: {roomCode}</p>
          <p className="text-2xl font-bold text-white">
            {isCurrentPlayerTurn
              ? <span className="text-green-400">🎮 Your Turn</span>
              : (
                <span className="text-yellow-400">
                  ⏳ {currentPlayer?.username}'s Turn
                </span>
              )}
          </p>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Discard and Draw Pile */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-12 text-center border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-8">Play Area</h2>

              {/* Discard Pile */}
              <div className="mb-8">
                <p className="text-gray-400 mb-4 uppercase text-sm tracking-wider">
                  Discard Pile
                </p>
                <div className="flex justify-center items-center gap-2">
                  {discardPile.length > 0 && (
                    <div className="relative">
                      {discardPile.map((card, index) => (
                        <div
                          key={card.id}
                          style={{
                            transform: `rotate(${index * 2}deg)`,
                            zIndex: index,
                          }}
                        >
                          {renderCard(card)}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-gray-400 text-sm">
                    <p className="font-semibold">
                      {currentColor && (
                        <span
                          className={`inline-block w-6 h-6 rounded-full ${
                            getColorClass(
                              currentColor,
                            )
                          }`}
                        />
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Draw Pile */}
              <div>
                <p className="text-gray-400 mb-4 uppercase text-sm tracking-wider">
                  Draw Pile
                </p>
                <div className="flex justify-center gap-4 items-center flex-col">
                  <div className="w-16 h-24 rounded-lg bg-slate-700 flex items-center justify-center text-gray-400 border-2 border-dashed border-slate-600 cursor-pointer hover:border-slate-500">
                    <span className="text-2xl font-bold">{deck.length}</span>
                  </div>

                  {/* Draw Card Button */}
                  {isCurrentPlayerTurn && !isGameFinished &&
                    !hasPlayableCards && (
                    <Button
                      onClick={handleDrawCard}
                      variant="success"
                      size="sm"
                      disabled={isDrawing}
                    >
                      {isDrawing ? "Drawing..." : "Draw Card"}
                    </Button>
                  )}

                  {isCurrentPlayerTurn && !isGameFinished && hasPlayableCards &&
                    (
                      <p className="text-yellow-400 text-sm font-semibold">
                        Play a card first
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Game Info Sidebar */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-6">Players</h3>
            <div className="space-y-3">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className={`p-3 rounded-lg border-2 ${
                    index === currentPlayerIndex
                      ? "bg-green-900 border-green-400"
                      : "bg-slate-700 border-slate-600"
                  }`}
                >
                  <p className="text-white font-semibold text-sm">
                    {player.username}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Cards: {player.cardCount}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-600">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Current Card
              </p>
              {discardPile.length > 0 && (
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-12 rounded ${
                      getColorClass(
                        currentColor,
                      )
                    }`}
                  />
                  <div>
                    <p className="text-white font-bold">{currentValue}</p>
                    <p className="text-xs text-gray-400 capitalize">
                      {currentColor}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Player's Hand */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6">Your Hand</h2>
          {hand.length > 0
            ? (
              <div className="flex flex-wrap gap-4">
                {hand.map((card) => renderCard(card))}
              </div>
            )
            : (
              <p className="text-gray-400 text-center py-8">
                Waiting for game state...
              </p>
            )}
        </div>
      </div>

      {/* Winner Modal */}
      {isGameFinished && winner && (
        <WinnerModal
          winner={winner}
          roomCode={roomCode}
          onExitGame={handleBackToHome}
        />
      )}
    </div>
  );
}
