import { handlePing } from "./handlers/pingHandler.js";
import { setupLobbyHandlers } from "./handlers/lobbyHandler.js";
import { setupGameHandlers } from "./handlers/gameHandler.js";
import { getRoom, removePlayerFromRoom } from "../rooms/roomManager.js";
import { logger } from "../utils/logger.js";

export const setupSocketHandlers = (socket, io) => {
  // Ping handler
  handlePing(socket, io);

  // Lobby handlers
  setupLobbyHandlers(socket, io);

  // Game handlers
  setupGameHandlers(socket, io);

  // Handle disconnect - clean up rooms
  socket.on("disconnect", () => {
    // Find and remove player from all rooms
    socket.rooms.forEach((roomCode) => {
      if (roomCode !== socket.id) {
        removePlayerFromRoom(roomCode, socket.id);
        // Notify remaining players
        const room = getRoom(roomCode);
        io.to(roomCode).emit("lobbyUpdated", {
          room,
        });
      }
    });
    logger.info(`User disconnected: ${socket.id}`);
  });
};
