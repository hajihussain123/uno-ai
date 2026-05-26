import { create } from 'zustand'

export const useGameStore = create((set) => ({
  gameId: null,
  gameState: 'waiting', // waiting, playing, finished
  players: [],
  currentTurn: null,
  hand: [],
  discardPile: [],
  drawPile: [],

  setGameId: (gameId) => set({ gameId }),
  setGameState: (gameState) => set({ gameState }),
  setPlayers: (players) => set({ players }),
  setCurrentTurn: (currentTurn) => set({ currentTurn }),
  setHand: (hand) => set({ hand }),
  setDiscardPile: (discardPile) => set({ discardPile }),
  setDrawPile: (drawPile) => set({ drawPile }),

  reset: () =>
    set({
      gameId: null,
      gameState: 'waiting',
      players: [],
      currentTurn: null,
      hand: [],
      discardPile: [],
      drawPile: [],
    }),
}))
