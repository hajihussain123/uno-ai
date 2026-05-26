import { create } from "zustand";

export const useLobbyStore = create((set) => ({
  currentRoom: null,
  players: [],
  isCreatingLobby: false,

  setCurrentRoom: (currentRoom) => set({ currentRoom }),
  setPlayers: (players) => set({ players }),
  setIsCreatingLobby: (isCreatingLobby) => set({ isCreatingLobby }),

  addPlayer: (player) =>
    set((state) => ({
      players: [...state.players, player],
    })),

  removePlayer: (playerId) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== playerId),
    })),

  reset: () =>
    set({
      currentRoom: null,
      players: [],
      isCreatingLobby: false,
    }),
}));
