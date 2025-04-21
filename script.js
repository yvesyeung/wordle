let guessWord = ["", "", "", "", ""];
let currRow = 0;
let currTile = 0;
let row = document.getElementsByClassName("row")[currRow];
let tiles = row.getElementsByClassName("tile");
const result = document.getElementById("result");

// Function to get daily word
const getWord = async function () {
  const response = await fetch("/word");
  const data = await response.json();
  return data.word;
};

// Function to handle submitted guess
const submitGuess = async function () {
  const targetWord = await getWord();
  console.log(targetWord);

  // Word not long enough
  if (currTile < 5) {
    result.textContent = "Not enough letters!";
    result.classList.remove("shake");
    void result.offsetWidth;
    result.classList.add("shake");
    return;
  }

  const isValid = await isValidWord(guessWord.join(""));

  // Word is invalid
  if (!isValid) {
    result.textContent = "Invalid word!";
    result.classList.remove("shake");
    void result.offsetWidth;
    result.classList.add("shake");
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
    result.textContent = "You win!";
    result.classList.remove("shake");
    void result.offsetWidth;
    result.classList.add("shake");
    return;
  }

  // Player loses
  if (currRow == 5) {
    result.textContent = `You lose! The word was ${targetWord}!`;
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

// Function to check if word is valid
const isValidWord = async function (word) {
  const response = await fetch(
    `https://api.datamuse.com/words?sp=${word}&max=1`
  );
  const data = await response.json();
  return data.length > 0 && data[0].word.toLowerCase() === word.toLowerCase();
};

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
