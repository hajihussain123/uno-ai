import { logger } from '../../utils/logger.js'

export const handlePing = (socket, io) => {
  socket.on('ping', (data) => {
    logger.info(`Ping received from ${socket.id}: ${JSON.stringify(data)}`)
    socket.emit('pong', {
      message: 'Pong from server',
      receivedAt: new Date().toISOString(),
    })
    logger.info(`Pong sent to ${socket.id}`)
  })
}
