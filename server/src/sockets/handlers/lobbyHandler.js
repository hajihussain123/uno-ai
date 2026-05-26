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
  // Create Room
  socket.on("createRoom", (data, callback) => {
    try {
      const { username } = data;
      const room = createRoom(socket.id, username);

      // Join the socket to a room namespace
      socket.join(room.roomCode);

      logger.info(`Room created: ${room.roomCode} by ${username}`);

      // Return room to client
      callback({
        success: true,
        room,
      });
    } catch (error) {
      logger.error("Error creating room:", error);
      callback({
        success: false,
        error: error.message,
      });
    }
  });

  // Join Room
  socket.on("joinRoom", (data, callback) => {
    try {
      const { roomCode, username } = data;
      const room = getRoom(roomCode);

      if (!room) {
        callback({
          success: false,
          error: "Room not found",
        });
        return;
      }

      if (room.status === "started") {
        callback({
          success: false,
          error: "Game already started",
        });
        return;
      }

      // Join room
      joinRoom(roomCode, socket.id, username);
      socket.join(roomCode);

      logger.info(`Player ${username} joined room ${roomCode}`);

      // Broadcast updated lobby to all players in room
      io.to(roomCode).emit("lobbyUpdated", {
        room: getRoom(roomCode),
      });

      callback({
        success: true,
        room: getRoom(roomCode),
      });
    } catch (error) {
      logger.error("Error joining room:", error);
      callback({
        success: false,
        error: error.message,
      });
    }
  });

  // Start Game
  socket.on("startGame", (data, callback) => {
    try {
      const { roomCode } = data;
      const room = getRoom(roomCode);

      if (!room) {
        callback({
          success: false,
          error: "Room not found",
        });
        return;
      }

      // Start the game
      startGame(roomCode);

      // Initialize game state
      const gameState = initializeGame(room.players);
      setGameState(roomCode, gameState);

      logger.info(`Game started in room ${roomCode}`);

      // Broadcast game started to all players
      io.to(roomCode).emit("gameStarted", {
        roomCode,
      });

      // Broadcast initial game state to all players
      io.to(roomCode).emit("gameStateUpdated", {
        roomCode,
        gameState,
      });

      callback({
        success: true,
      });
    } catch (error) {
      logger.error("Error starting game:", error);
      callback({
        success: false,
        error: error.message,
      });
    }
  });

  // Handle disconnect - remove player from room
  socket.on("disconnect", () => {
    // This will be handled in the disconnect handler in index.js
  });
};
