// In-memory room storage
const rooms = new Map();

// Generate a simple room code
export const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create a new room
export const createRoom = (hostId, hostUsername) => {
  const roomCode = generateRoomCode();
  const room = {
    roomCode,
    hostId,
    hostUsername,
    players: [
      {
        id: hostId,
        username: hostUsername,
        isHost: true,
      },
    ],
    status: "waiting", // waiting | started
    createdAt: new Date(),
  };
  rooms.set(roomCode, room);
  return room;
};

// Get room by code
export const getRoom = (roomCode) => {
  return rooms.get(roomCode);
};

// Join room
export const joinRoom = (roomCode, playerId, playerUsername) => {
  const room = rooms.get(roomCode);
  if (!room) return null;

  // Check if player already in room
  const playerExists = room.players.some((p) => p.id === playerId);
  if (playerExists) {
    return room;
  }

  // Add player
  room.players.push({
    id: playerId,
    username: playerUsername,
    isHost: false,
  });
  return room;
};

// Remove player from room
export const removePlayerFromRoom = (roomCode, playerId) => {
  const room = rooms.get(roomCode);
  if (!room) return;

  room.players = room.players.filter((p) => p.id !== playerId);

  // Delete room if empty
  if (room.players.length === 0) {
    rooms.delete(roomCode);
  }
};

// Start game
export const startGame = (roomCode) => {
  const room = rooms.get(roomCode);
  if (!room) return null;
  room.status = "started";
  return room;
};

// Delete room
export const deleteRoom = (roomCode) => {
  rooms.delete(roomCode);
};
