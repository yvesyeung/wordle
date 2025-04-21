// Manage game state
const targetWord = await getWord();
let guessWord = ["", "", "", "", ""];
let currRow = 0;
let currTile = 0;

// Get HTML elements
let row = document.getElementsByClassName("row")[currRow];
let tiles = row.getElementsByClassName("tile");
const result = document.getElementById("result");

// Function to get daily word
async function getWord() {
  const response = await fetch(
    "https://pacific-crag-02720-276b4f747b19.herokuapp.com/word"
  );
  const data = await response.json();
  return data.word;
}

// Function to check if word is valid
async function isValidWord(word) {
  const response = await fetch(
    `https://api.datamuse.com/words?sp=${word}&max=1`
  );
  const data = await response.json();
  return data.length > 0 && data[0].word.toLowerCase() === word.toLowerCase();
}

// Function to animate result message
function shake(message) {
  message.classList.remove("shake");
  void message.offsetWidth;
  message.classList.add("shake");
}

// Function to handle submitted guess
async function submitGuess() {
  // Check if word is long enough
  if (currTile < 5) {
    result.textContent = "Not enough letters!";
    shake(result);
    return;
  }

  // Check if word is invalid
  const isValid = await isValidWord(guessWord.join(""));
  if (!isValid) {
    result.textContent = "Invalid word!";
    shake(result);
    return;
  }

  let target = targetWord.split("");
  let status = Array(5).fill("absent");
  let correctLetters = 0;

  // Identify any correct letters
  for (let i = 0; i < 5; i++) {
    if (tiles[i].textContent.toUpperCase() == targetWord[i]) {
      status[i] = "correct";
      target[i] = null; // Mark letter as used
      correctLetters++;
    }
  }

  // Identify any present characters
  for (let i = 0; i < 5; i++) {
    if (status[i] == "correct") continue;
    const index = target.indexOf(tiles[i].textContent.toUpperCase());
    if (index !== -1) {
      status[i] = "present";
      target[index] = null;
    }
  }

  // Update UI
  for (let i = 0; i < 5; i++) {
    tiles[i].classList.add(status[i]);
  }

  // Player wins
  if (correctLetters == 5) {
    result.textContent = "You win! Play again tomorrow for a new word!";
    shake(result);
    return;
  }

  // Player loses
  if (currRow == 5) {
    result.textContent = `You lose! The word was ${targetWord}!`;
    shake(result);
    return;
  }

  // Go to next row
  if (currRow < 5) {
    currRow++;
    currTile = 0;
    row = document.getElementsByClassName("row")[currRow];
    tiles = row.getElementsByClassName("tile");
    result.textContent = "Guess again";
    shake(result);
  }
}

// Listen to key presses and take appropriate action
document.addEventListener("keydown", function (event) {
  if (/^[a-zA-Z]$/.test(event.key) && currTile < 5) {
    tiles[currTile].textContent = event.key;
    guessWord[currTile] = event.key;
    currTile++;
  } else if (event.key == "Backspace" && currTile > 0) {
    currTile--;
    tiles[currTile].textContent = "";
  } else if (event.key == "Enter") {
    submitGuess();
  }
});
