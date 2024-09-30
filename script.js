const colors = ["red", "green", "blue", "yellow"];
const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "skip", "reverse", "draw-2"];
let deck = [];

let currentPlayer = 0;  // El jugador que está actualmente en turno (0, 1 o 2)
let direction = 1;  // Dirección de los turnos, 1 para adelante, -1 para atrás
const numCardsPerPlayer = 7;
let playerHands = dealCards([1, 2, 3], numCardsPerPlayer);
let discardPile = [];

  // Generar la baraja de cartas
function generateDeck() {
  colors.forEach(color => {
    values.forEach(value => {
      deck.push({ color, value });
      if (value !== "0") deck.push({ color, value });  // Añadir una copia adicional si no es "0"
    });
  });
  return deck;
}

// Función para repartir cartas
function dealCards(players, numCards) {
  console.log("🚀 ~ dealCards ~ players:", players)
  let deck = generateDeck();
  deck = deck.sort(() => Math.random() - 0.5);  // Barajar el mazo

  let hands = players.map(() => []);  // Crear una mano vacía para cada jugador

  for (let i = 0; i < numCards; i++) {
    players.forEach((_, index) => {
      if (deck.length > 0) {
        hands[index].push(deck.pop());  // Repartir una carta a cada jugador
      }
    });
  }

  return { hands, deck };  // Retornar las manos de los jugadores y el mazo restante
}

// Función para manejar cuando un jugador roba cartas
function drawCardForPlayer(playerIndex, numCards = 1) {
  for (let i = 0; i < numCards; i++) {
    if (deck.length > 0) {
      hands[playerIndex].push(deck.pop());  // Añadir una carta del mazo a la mano del jugador
    } else {
      alert("El mazo se ha quedado sin cartas.");
    }
  }

  // Actualizar la mano del jugador en el DOM
  displayHand(hands[playerIndex], `player${playerIndex + 1}-hand`, playerIndex === currentPlayer);
}

// Función para mostrar la mano de un jugador
function displayHand(hand, elementId, isCurrentPlayer = false) {
  console.log("🚀 ~ displayHand ~ hand:", hand)
  const handDiv = document.getElementById(elementId);
  handDiv.innerHTML = ''; // Limpiar el contenido anterior

  hand.forEach((card, index) => {
    const cardDiv = document.createElement("img");
    cardDiv.classList.add("card");
    cardDiv.src = `images/${card.color}${card.value}.png`;
    cardDiv.alt = `${card.color} ${card.value}`;

    if (isCurrentPlayer) {
      // Permitir que el jugador actual haga clic en sus cartas
      cardDiv.addEventListener('click', () => handleCardPlay(card, index));
    }

    handDiv.appendChild(cardDiv);
  });
}

// Función para mostrar la carta de la pila abierta
function displayDiscardCard(card) {
  const discardCard = document.getElementById("discard-card");
  discardCard.src = `images/${card.color}${card.value}.png`;
  discardCard.alt = `${card.color} ${card.value}`;
}

// Función para mostrar la carta de la pila volteada (mazo)
function displayDeckCard() {
  const deckCard = document.getElementById("deck-card");
  deckCard.src = `images/back.png`; // Asumimos que la parte trasera de las cartas es "back.png"
  deckCard.alt = "Mazo de cartas volteadas";
}

// Función para agregar cartas a la mano de un jugador
function addCardsToPlayer(playerIndex, numCards) {
  for (let i = 0; i < numCards; i++) {
    if (deck.length > 0) {
      playerHands.hands[playerIndex].push(deck.pop());  // Robar una carta del mazo
    } else {
      alert("El mazo se ha quedado sin cartas.");
    }
  }
  displayHand(playerHands.hands[playerIndex], `player${playerIndex + 1}-hand`); // Actualizar la mano del jugador en el DOM
}

  // Turno de la computadora
function computerTurn() {
  let validCardIndex = playerHands.hands[1].findIndex(card => isValidPlay(card, discardPile[discardPile.length - 1]));
  
  if (validCardIndex !== -1) {
    let card = playerHands.hands[1].splice(validCardIndex, 1)[0];  // Jugar la carta válida
    discardPile.push(card);
    displayDiscardCard(card);
    if (card.value === "draw-2") {
      // Si la carta es "más dos", el siguiente jugador roba 2 cartas
      const nextPlayer = (currentPlayer + direction + playerHands.hands.length) % playerHands.hands.length; // Siguiente jugador
      addCardsToPlayer(nextPlayer, 2);  // Añadir 2 cartas al siguiente jugador
    } else {
      // Actualizar la mano del jugador en el DOM después de jugar la carta
      displayHand(playerHands.hands[currentPlayer], `player${currentPlayer + 1}-hand`, true);
    }
  } else {
    alert('Computadora no tiene una carta válida y roba una carta.');
    playerHands.hands[1].push(deck.pop());  // La computadora roba una carta si no tiene una válida
  }
  nextTurn();  // Pasar al siguiente turno
}

// Función para cambiar el turno al siguiente jugador
function nextTurn() {
  currentPlayer = (currentPlayer + direction + playerHands.hands.length) % playerHands.hands.length;  // Cambiar el turno
  updateTurnIndicator();

  if (currentPlayer === 1) {
    setTimeout(computerTurn, 1000);  // Esperar 1 segundo antes de que juegue la computadora
  } else {
    displayHand(playerHands.hands[currentPlayer], `player${currentPlayer + 1}-hand`, true);  // Mostrar la mano del jugador actual
  }
}



  // Actualizar el indicador de turno
function updateTurnIndicator() {
  const turnIndicator = document.getElementById("turn-indicator");
  turnIndicator.textContent = `Turno del Jugador ${currentPlayer + 1}`;
}

  // Función para manejar cuando el jugador juega una carta
function handleCardPlay(card, cardIndex) {
  console.log("🚀 ~ handleCardPlay ~ card:", card)
  console.log("🚀 ~ handleCardPlay ~ currentPlayer:", currentPlayer)
  if (isValidPlay(card, discardPile[discardPile.length - 1])) {
    playerHands.hands[currentPlayer].splice(cardIndex, 1);  // Eliminar la carta jugada de la mano del jugador
    discardPile.push(card);  // Añadir la carta a la pila abierta
    displayDiscardCard(card);  // Actualizar la carta en la pila abierta
    if (card.value === "draw-2") {
      // Si la carta es "más dos", el siguiente jugador roba 2 cartas
      const nextPlayer = (currentPlayer + direction + playerHands.hands.length) % playerHands.hands.length; // Siguiente jugador
      addCardsToPlayer(nextPlayer, 2);  // Añadir 2 cartas al siguiente jugador
    } else {
      // Actualizar la mano del jugador en el DOM después de jugar la carta
      displayHand(playerHands.hands[currentPlayer], `player${currentPlayer + 1}-hand`, true);
    }
    nextTurn();  // Pasar al siguiente turno
  } else {
    alert('Movimiento inválido.');
  }
}

// Función para que el jugador robe cartas si no tiene una carta válida
function playerDrawCard() {
  drawCardForPlayer(currentPlayer);  // El jugador actual roba una carta
  nextTurn();  // Pasar el turno al siguiente jugador
}

  // Función para validar si una carta puede jugarse
function isValidPlay(card, topDiscardCard) {
  return card.color === topDiscardCard.color || card.value === topDiscardCard.value;
}


const startGame = () => {
  console.log("🚀 ~ startGame ~ playerHands:", playerHands)

  // Mostrar las manos de los jugadores en el DOM
  displayHand(playerHands.hands[0], "player1-hand", true);  // Mano del Jugador 1
  displayHand(playerHands.hands[1], "player2-hand");  // Mano del Jugador 2 (Computadora)
  displayHand(playerHands.hands[2], "player3-hand");  // Mano del Jugador 3

  // Tomar la primera carta para la pila abierta
  discardPile.push(deck.pop());
  displayDiscardCard(discardPile[discardPile.length - 1]);
  
  //   // Mostrar la primera carta de la pila abierta
  // const firstDiscardCard = deck.pop(); // Tomar la última carta del mazo como la primera carta de la pila abierta
  // console.log("🚀 ~ startGame ~ firstDiscardCard:", firstDiscardCard)
  // displayDiscardCard(firstDiscardCard);

    // Mostrar el mazo volteado
  displayDeckCard();
  
  displayDiscardCard(discardPile[discardPile.length - 1]);
}

startGame()
updateTurnIndicator();

  // Botón para robar una carta
document.getElementById('draw-button').addEventListener('click', () => {
  playerHands.hands[currentPlayer].push(deck.pop());
  displayHand(playerHands.hands[currentPlayer], `player${currentPlayer + 1}-hand`, true);
  nextTurn();
});