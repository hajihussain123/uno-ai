import { logger } from "../../utils/logger.js";
import {
  createRoom,
  getRoom,
  joinRoom,
  removePlayerFromRoom,
  setGameState,
  startGame,
} from "../../rooms/roomManager.js";
import { initializeGame } from "../../game/gameInitializer.js";

export const setupLobbyHandlers = (socket, io) => {
  socket.on("createRoom", (data, callback) => {
    try {
      const { username } = data;
      const room = createRoom(socket.id, username);

      socket.join(room.roomCode);

      logger.info(`Room created: ${room.roomCode} by ${username}`);

      callback?.({
        success: true,
        room,
      });
    } catch (error) {
      logger.error("Error creating room:", error);
      callback?.({
        success: false,
        error: error.message,
      });
    }
  });

  socket.on("joinRoom", (data, callback) => {
    try {
      const { roomCode, username } = data;
      const room = getRoom(roomCode);

      if (!room) {
        callback?.({
          success: false,
          error: "Room not found",
        });
        return;
      }

      if (room.status === "started") {
        callback?.({
          success: false,
          error: "Game already started",
        });
        return;
      }

      joinRoom(roomCode, socket.id, username);
      socket.join(roomCode);

      logger.info(`Player ${username} joined room ${roomCode}`);

      io.to(roomCode).emit("lobbyUpdated", {
        room: getRoom(roomCode),
      });

      callback?.({
        success: true,
        room: getRoom(roomCode),
      });
    } catch (error) {
      logger.error("Error joining room:", error);
      callback?.({
        success: false,
        error: error.message,
      });
    }
  });

  socket.on("startGame", (data, callback) => {
    try {
      const { roomCode } = data;
      const room = getRoom(roomCode);

      if (!room) {
        callback?.({
          success: false,
          error: "Room not found",
        });
        return;
      }

      startGame(roomCode);

      const gameState = initializeGame(room.players);
      setGameState(roomCode, gameState);

      logger.info(`Game started in room ${roomCode}`);

      io.to(roomCode).emit("gameStarted", {
        roomCode,
      });

      const buildForRecipient = (recipientId) => {
        const sanitizedPlayers = gameState.players.map((p) => {
          if (p.id === recipientId) {
            return { ...p, hand: p.hand, cardCount: p.hand.length };
          }
          return { id: p.id, username: p.username, cardCount: p.cardCount };
        });

        return {
          ...gameState,
          players: sanitizedPlayers,
        };
      };

      gameState.players.forEach((p) => {
        const stateForP = buildForRecipient(p.id);
        io.to(p.id).emit("gameStateUpdated", {
          roomCode,
          gameState: stateForP,
        });
      });

      callback?.({
        success: true,
      });
    } catch (error) {
      logger.error("Error starting game:", error);
      callback?.({
        success: false,
        error: error.message,
      });
    }
  });

  // Handle disconnect - remove player from room
  socket.on("disconnect", () => {
    // This will be handled in the disconnect handler in index.js
  });

  // Play Card
  socket.on("playCard", (data) => {
    try {
      const { roomCode, cardId } = data;
      const room = getRoom(roomCode);

      if (!room) {
        socket.emit("error", { roomCode, error: "Room not found" });
        return;
      }

      const gameState = room.gameState;
      if (!gameState || gameState.status !== "playing") {
        socket.emit("error", { roomCode, error: "Game not in progress" });
        return;
      }

      const playerIndex = gameState.players.findIndex((p) =>
        p.id === socket.id
      );
      if (playerIndex === -1) {
        socket.emit("error", { roomCode, error: "Player not in room" });
        return;
      }

      if (gameState.currentPlayerIndex !== playerIndex) {
        socket.emit("error", { roomCode, error: "Not your turn" });
        return;
      }

      const player = gameState.players[playerIndex];
      const cardIndex = (player.hand || []).findIndex((c) => c.id === cardId);
      if (cardIndex === -1) {
        socket.emit("error", {
          roomCode,
          error: "Card not found in your hand",
        });
        return;
      }

      const card = player.hand[cardIndex];

      // Simple validity: same color OR same value
      const isValid = card.color === gameState.currentColor ||
        card.value === gameState.currentValue;
      if (!isValid) {
        socket.emit("error", { roomCode, error: "Card not playable" });
        return;
      }

      // Apply play: remove from hand
      player.hand.splice(cardIndex, 1);
      player.cardCount = player.hand.length;

      // Update discard pile and current markers
      gameState.discardPile.push(card);
      gameState.currentColor = card.color;
      gameState.currentValue = card.value;

      // Advance turn
      gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) %
        gameState.players.length;

      // Persist game state
      setGameState(roomCode, gameState);

      // Helper to sanitize game state per recipient (opponents see counts only)
      const buildForRecipient = (recipientId) => {
        const sanitizedPlayers = gameState.players.map((p) => {
          if (p.id === recipientId) {
            return { ...p, hand: p.hand, cardCount: p.hand.length };
          }
          return { id: p.id, username: p.username, cardCount: p.cardCount };
        });

        return {
          ...gameState,
          players: sanitizedPlayers,
        };
      };

      // Broadcast personalized game state to each player socket
      gameState.players.forEach((p) => {
        const stateForP = buildForRecipient(p.id);
        io.to(p.id).emit("gameStateUpdated", {
          roomCode,
          gameState: stateForP,
        });
      });
    } catch (error) {
      logger.error("Error handling playCard:", error);
      socket.emit("error", { error: error.message });
    }
  });
};
