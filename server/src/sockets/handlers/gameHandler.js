import { logger } from "../../utils/logger.js";
import { getRoom, setGameState } from "../../rooms/roomManager.js";

// Check if a card is playable
const isPlayable = (card, currentColor, currentValue) => {
  return card.color === currentColor || card.value === currentValue;
};

// Get playable cards from hand
const getPlayableCards = (hand, currentColor, currentValue) => {
  return hand.filter((card) => isPlayable(card, currentColor, currentValue));
};

// Move to next player
const getNextPlayerIndex = (currentIndex, playerCount) => {
  return (currentIndex + 1) % playerCount;
};

// Draw a single card from deck, reshuffling if needed
const drawCardFromDeck = (deck, discardPile) => {
  if (deck.length === 0) {
    // Reshuffle: take all but top card from discard, shuffle and use as new deck
    if (discardPile.length <= 1) {
      return null; // Not enough cards to draw
    }
    const newDeck = [...discardPile.slice(0, -1)]; // All but top card
    // Shuffle
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return { card: newDeck.pop(), newDeck, reshuffled: true };
  }
  return { card: deck.pop(), newDeck: deck, reshuffled: false };
};

export const setupGameHandlers = (socket, io) => {
  // Play Card
  socket.on("playCard", (data, callback) => {
    try {
      const { roomCode, cardId } = data;
      const room = getRoom(roomCode);

      if (!room || !room.gameState) {
        callback?.({
          success: false,
          error: "Room or game not found",
        });
        return;
      }

      const gameState = room.gameState;
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];

      // Verify this is the current player
      if (currentPlayer.id !== socket.id) {
        callback?.({
          success: false,
          error: "Not your turn",
        });
        return;
      }

      // Find card in hand
      const cardIndex = currentPlayer.hand.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) {
        callback?.({
          success: false,
          error: "Card not in hand",
        });
        return;
      }

      const card = currentPlayer.hand[cardIndex];

      // Check if card is playable
      if (!isPlayable(card, gameState.currentColor, gameState.currentValue)) {
        callback?.({
          success: false,
          error: "Card not playable",
        });
        return;
      }

      // Play the card
      currentPlayer.hand.splice(cardIndex, 1);
      currentPlayer.cardCount = currentPlayer.hand.length;
      gameState.discardPile.push(card);
      gameState.currentColor = card.color;
      gameState.currentValue = card.value;

      // Check for winner
      if (currentPlayer.hand.length === 0) {
        gameState.winner = currentPlayer.username;
        gameState.status = "finished";
        logger.info(`Player ${currentPlayer.username} won in room ${roomCode}`);
      } else {
        // Move to next player
        gameState.currentPlayerIndex = getNextPlayerIndex(
          gameState.currentPlayerIndex,
          gameState.players.length,
        );
      }

      setGameState(roomCode, gameState);

      // Broadcast updated state to all players
      const broadcastState = gameState.players.map((p) => ({
        ...p,
        hand: undefined, // Don't send hands in broadcast
        cardCount: p.cardCount,
      }));

      io.to(roomCode).emit("gameStateUpdated", {
        roomCode,
        gameState: {
          ...gameState,
          players: broadcastState,
        },
      });

      // Send full state with hand to current player
      const currentPlayerAfter =
        gameState.players[gameState.currentPlayerIndex];
      if (currentPlayerAfter) {
        const stateForCurrent = {
          ...gameState,
          players: gameState.players.map((p) => {
            if (p.id === currentPlayerAfter.id) {
              return { ...p, hand: p.hand, cardCount: p.hand.length };
            }
            return {
              id: p.id,
              username: p.username,
              cardCount: p.cardCount,
            };
          }),
        };
        io.to(currentPlayerAfter.id).emit("gameStateUpdated", {
          roomCode,
          gameState: stateForCurrent,
        });
      }

      callback?.({
        success: true,
      });
    } catch (error) {
      logger.error("Error playing card:", error);
      callback?.({
        success: false,
        error: error.message,
      });
    }
  });

  // Draw Card
  socket.on("drawCard", (data, callback) => {
    try {
      const { roomCode } = data;
      const room = getRoom(roomCode);

      if (!room || !room.gameState) {
        callback?.({
          success: false,
          error: "Room or game not found",
        });
        return;
      }

      const gameState = room.gameState;
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];

      // Verify this is the current player
      if (currentPlayer.id !== socket.id) {
        callback?.({
          success: false,
          error: "Not your turn",
        });
        return;
      }

      // Check if player has playable cards
      const playable = getPlayableCards(
        currentPlayer.hand,
        gameState.currentColor,
        gameState.currentValue,
      );
      if (playable.length > 0) {
        callback?.({
          success: false,
          error: "You have playable cards",
        });
        return;
      }

      // Draw a card
      const drawResult = drawCardFromDeck(
        gameState.deck,
        gameState.discardPile,
      );
      if (!drawResult || !drawResult.card) {
        callback?.({
          success: false,
          error: "Could not draw card",
        });
        return;
      }

      const { card, newDeck, reshuffled } = drawResult;
      currentPlayer.hand.push(card);
      currentPlayer.cardCount = currentPlayer.hand.length;
      gameState.deck = newDeck;

      if (reshuffled) {
        // If we reshuffled, discard pile now only has top card
        gameState.discardPile = [
          gameState.discardPile[gameState.discardPile.length - 1],
        ];
      }

      // Move to next player
      gameState.currentPlayerIndex = getNextPlayerIndex(
        gameState.currentPlayerIndex,
        gameState.players.length,
      );

      setGameState(roomCode, gameState);

      // Broadcast updated state
      const broadcastState = gameState.players.map((p) => ({
        ...p,
        hand: undefined,
        cardCount: p.cardCount,
      }));

      io.to(roomCode).emit("gameStateUpdated", {
        roomCode,
        gameState: {
          ...gameState,
          players: broadcastState,
        },
      });

      // Send full state with hand to next current player
      const nextCurrentPlayer = gameState.players[gameState.currentPlayerIndex];
      if (nextCurrentPlayer) {
        const stateForNext = {
          ...gameState,
          players: gameState.players.map((p) => {
            if (p.id === nextCurrentPlayer.id) {
              return { ...p, hand: p.hand, cardCount: p.hand.length };
            }
            return {
              id: p.id,
              username: p.username,
              cardCount: p.cardCount,
            };
          }),
        };
        io.to(nextCurrentPlayer.id).emit("gameStateUpdated", {
          roomCode,
          gameState: stateForNext,
        });
      }

      callback?.({
        success: true,
      });
    } catch (error) {
      logger.error("Error drawing card:", error);
      callback?.({
        success: false,
        error: error.message,
      });
    }
  });
};
