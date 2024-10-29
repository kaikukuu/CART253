🔥 Hot tip: Choosing a random element in an array
Sometimes it could be really cool to choose a random element in an array, right? Like, say, a fortune! Well, it’s pretty easy with random()!

const fortunes = [
  "It's going to be okay.",
  "You will win $1.25 unexpectedly.",
  "Meh.",
  "You probably won't die today."  
];

// Put a random fortune (one of the four) into a variable
let randomFortune = random(fortunes);
Easy as that.

You can also do this a bit more manually using only Plain JavaScript:

const fortunes = [
  "It's going to be okay.",
  "You will win $1.25 unexpectedly.",
  "Meh.",
  "You probably won't die today."  
];

// Get a random index in the array
let randomIndex = Math.floor(Math.random() * fortunes.length);
// Get the random element at the index
let randomFortune = fortunes[randomIndex];
Or if you wanted to practice writing your own helper functions:

const fortunes = [
  "It's going to be okay.",
  "You will win $1.25 unexpectedly.",
  "Meh.",
  "You probably won't die today."  
];

// Get the random element from the array
let randomFortune = getRandomElement(fortunes);

/**
 * Returns a random element from the provided array
 */
function getRandomElement(array) {
  // Calculate a random index in the array
  const randomIndex = Math.floor(Math.random() * array.length);
  // Return the element at that index
  return array[randomIndex];
}