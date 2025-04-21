const word = "HELLO"; // Word to guess
let currRow = 0;
let currTile = 0;
let row = document.getElementsByClassName("row")[currRow];
let tiles = row.getElementsByClassName("tile");
const result = document.getElementById("result");

// Handle submitted guess
const submitGuess = function () {
  // Word not long enough
  if (currTile < 5) {
    result.textContent = "Not enough letters!";
    result.classList.remove("shake");
    void result.offsetWidth;
    result.classList.add("shake");
    return;
  }

  // TODO: Handle invalid word

  let tempWord = word.split("");
  let status = Array(5).fill("absent");
  let correctLetters = 0;

  // Identify any correct letters
  for (let i = 0; i < 5; i++) {
    if (tiles[i].textContent.toUpperCase() == word[i]) {
      status[i] = "correct";
      tempWord[i] = null; // Mark letter as used
      correctLetters++;
    }
  }

  // Identify any present characters
  for (let i = 0; i < 5; i++) {
    if (status[i] == "correct") continue;
    const index = tempWord.indexOf(tiles[i].textContent.toUpperCase());
    if (index !== -1) {
      status[i] = "present";
      tempWord[index] = null;
    }
  }

  // Update UI
  for (let i = 0; i < 5; i++) {
    tiles[i].classList.add(status[i]);
  }

  // Player wins
  if (correctLetters == 5) {
    result.textContent = "You win!";
    result.classList.remove("shake");
    void result.offsetWidth;
    result.classList.add("shake");
    return;
  }

  // Player loses
  if (currRow == 5) {
    result.textContent = `You lose! The word was ${word}!`;
    result.classList.remove("shake");
    void result.offsetWidth;
    result.classList.add("shake");
    return;
  }

  // Go to next row
  if (currRow < 5) {
    currRow++;
    currTile = 0;
    row = document.getElementsByClassName("row")[currRow];
    tiles = row.getElementsByClassName("tile");
    result.textContent = "Guess again";
    result.classList.remove("shake");
    void result.offsetWidth;
    result.classList.add("shake");
  }
};

// Listen to key presses and take appropriate action
document.addEventListener("keydown", function (event) {
  if (/^[a-zA-Z]$/.test(event.key) && currTile < 5) {
    tiles[currTile].textContent = event.key;
    currTile++;
  } else if (event.key == "Backspace" && currTile > 0) {
    currTile--;
    tiles[currTile].textContent = "";
  } else if (event.key == "Enter") {
    submitGuess();
  }
});
