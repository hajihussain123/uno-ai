import { handlePing } from './handlers/pingHandler.js'

export const setupSocketHandlers = (socket, io) => {
  // Ping handler
  handlePing(socket, io)

  // TODO: Add more socket handlers here
  // - Lobby handlers
  // - Game handlers
  // - Player handlers
}
