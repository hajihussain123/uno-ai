import { create } from "zustand";

export const useGameStore = create((set) => ({
  roomCode: null,
  gameState: "waiting", // waiting, playing, finished
  players: [],
  currentPlayerIndex: 0,
  currentColor: null,
  currentValue: null,
  hand: [],
  discardPile: [],
  deck: [],
  winner: null,

  setRoomCode: (roomCode) => set({ roomCode }),
  setGameState: (gameState) => set({ gameState }),
  setPlayers: (players) => set({ players }),
  setCurrentPlayerIndex: (currentPlayerIndex) => set({ currentPlayerIndex }),
  setCurrentColor: (currentColor) => set({ currentColor }),
  setCurrentValue: (currentValue) => set({ currentValue }),
  setHand: (hand) => set({ hand }),
  setDiscardPile: (discardPile) => set({ discardPile }),
  setDeck: (deck) => set({ deck }),
  setWinner: (winner) => set({ winner }),

  updateFromGameState: (gameState, playerUsername) =>
    set((state) => {
      const status = gameState.status || "playing";
      const currentPlayer = gameState.players.find(
        (p) => p.username === playerUsername,
      );
      const hand = currentPlayer?.hand || [];

      return {
        gameState: status,
        players: gameState.players,
        currentPlayerIndex: gameState.currentPlayerIndex,
        currentColor: gameState.currentColor,
        currentValue: gameState.currentValue,
        hand,
        discardPile: gameState.discardPile,
        deck: gameState.deck,
        winner: gameState.winner,
      };
    }),

  reset: () =>
    set({
      roomCode: null,
      gameState: "waiting",
      players: [],
      currentPlayerIndex: 0,
      currentColor: null,
      currentValue: null,
      hand: [],
      discardPile: [],
      deck: [],
      winner: null,
    }),
}));
