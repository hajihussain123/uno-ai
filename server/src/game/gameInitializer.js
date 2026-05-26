// UNO card definitions
const COLORS = ["red", "blue", "green", "yellow"];
const VALUES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Create a single card
const createCard = (color, value) => ({
  id: `${color}-${value}-${Math.random()}`,
  color,
  value,
  type: "number",
});

// Create the full deck (number cards only)
// 1 card of 0 for each color, 2 cards of 1-9 for each color
export const createDeck = () => {
  const deck = [];

  COLORS.forEach((color) => {
    // One 0 card per color
    deck.push(createCard(color, "0"));

    // Two of each 1-9 per color
    VALUES.slice(1).forEach((value) => {
      deck.push(createCard(color, value));
      deck.push(createCard(color, value));
    });
  });

  return deck;
};

// Fisher-Yates shuffle
export const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Distribute initial hands
export const distributeCards = (deck, numPlayers, cardsPerPlayer = 5) => {
  const hands = Array.from({ length: numPlayers }, () => []);
  const remaining = [...deck];

  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let p = 0; p < numPlayers; p++) {
      hands[p].push(remaining.pop());
    }
  }

  return { hands, deck: remaining };
};

// Find first playable card for discard pile
const isPlayableAsStart = (card) => {
  // For now, any number card is playable
  return card.type === "number";
};

// Initialize game state
export const initializeGame = (players) => {
  if (players.length < 2 || players.length > 4) {
    throw new Error("Game requires 2-4 players");
  }

  // Create and shuffle deck
  let deck = createDeck();
  deck = shuffleDeck(deck);

  // Distribute cards to players
  const { hands, deck: remainingDeck } = distributeCards(
    deck,
    players.length,
    5,
  );

  // Find first playable card for discard pile
  let discardPile = [];
  let discardCard = remainingDeck.pop();

  // Keep popping until we find a number card (they're all number cards currently)
  while (!isPlayableAsStart(discardCard) && remainingDeck.length > 0) {
    deck.push(discardCard);
    discardCard = remainingDeck.pop();
  }

  if (!discardCard) {
    throw new Error("Could not find playable card for discard pile");
  }

  discardPile.push(discardCard);

  // Add hands to players
  const playersWithHands = players.map((player, index) => ({
    ...player,
    hand: hands[index],
    cardCount: hands[index].length,
  }));

  // Create game state
  const gameState = {
    deck: remainingDeck,
    discardPile,
    players: playersWithHands,
    currentPlayerIndex: 0,
    currentColor: discardCard.color,
    currentValue: discardCard.value,
    winner: null,
    status: "playing",
  };

  return gameState;
};
