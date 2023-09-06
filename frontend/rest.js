import { selectedArtist, favoriteArtists, updateArtistGrid } from "./frontApp.js";
//GLOBAL VARIABLES (ENDPOINT)
// const endpoint = "../backend/data/artists.json";
const endpoint = "http://localhost:3000";

// ----- GET ARTIST ----- \\
async function getArtists() {
  const response = await fetch(`${endpoint}/artists`);
  const data = await response.json();

  return data;
}

// ----- GET FAV ARTIST ----- \\
async function getFavArtists() {
  const response = await fetch(`${endpoint}/favorites`);
  const data = await response.json();

  return data;
}

// ----- CREATE ARTIST ----- \\
async function createArtist(event) {
  event.preventDefault();
  const form = event.target;

  const artistName = form.artistName.value;
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const genres = genresArr();

  function genresArr() {
    let arr = [];
    const str = form.genres.value;

    arr = str.split(", ");

    return arr;
  }

  const labels = labelsArr();

  function labelsArr() {
    let arr = [];
    const str = form.labels.value;

    arr = str.split(", ");

    return arr;
  }

  const website = form.website.value;
  const image = form.image.value;
  const shortDescription = form.shortDescription.value;

  const newArtist = { artistName, name, birthdate, activeSince, genres, labels, website, image, shortDescription };
  const artistAsJson = JSON.stringify(newArtist);
  const response = await fetch(`${endpoint}/artists`, {
    method: "POST",
    body: artistAsJson,
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    // if success, update the artists grid
    console.log("artist submitted");
    updateArtistGrid();
  }
}

// ----- UPDATE ARTIST ----- \\
async function updateArtist(event) {
  event.preventDefault();

  //shorthand for form
  const form = event.target;

  //storing the form information in variables
  const artistName = form.artistName.value;
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const genres = genresArr();
  const labels = labelsArr();
  const website = form.website.value;
  const image = form.image.value;
  const shortDescription = form.shortDescription.value;
  const id = selectedArtist.id;

  //converting genres string to array
  function genresArr() {
    let arr = [];
    const str = form.genres.value;

    arr = str.split(", ");

    return arr;
  }

  //converting labels string to array
  function labelsArr() {
    let arr = [];
    const str = form.labels.value;

    arr = str.split(", ");

    return arr;
  }

  //creating an artist object, converting it to json format and "PUT" requesting the json data to specified endpoint destination
  const updatedArtist = { artistName, name, birthdate, activeSince, genres, labels, website, image, shortDescription, id };
  const updateAsJson = JSON.stringify(updatedArtist);
  const response = await fetch(`${endpoint}/artists/${selectedArtist.id}`, {
    method: "PUT",
    body: updateAsJson,
    headers: { "Content-Type": "application/json" },
  });

  console.log(response);
  if (response.ok) {
    // if success, update the artist grid
    updateArtistGrid();
  }
}

// ----- DELETE ARTIST ----- \\
async function deleteArtist(id) {
  console.log("artist deleted");
  // console.log(id);
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    // if success, update the artists grid
    updateArtistGrid();
  }
}

// ----- FAVORITE ARTIST ----- \\
async function toggleFavoriteArtist(artist, id) {
  //if clicked artist is already in favoriteArtists list, it returns to favoriteArtistScan if artist is returned then it is already favorited
  let favoriteArtistScan = favoriteArtists.find((artist) => artist.id === id);

  //checks what request to send based on favoriteArtistScan
  if (typeof favoriteArtistScan === "undefined") {
    const favArtistAsJson = JSON.stringify(artist);
    await fetch(`${endpoint}/favorites`, {
      method: "POST",
      body: favArtistAsJson,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    console.log("already exits");
    await fetch(`${endpoint}/favorites/${id}`, {
      method: "DELETE",
    });
  }
}

export { getArtists, getFavArtists, createArtist, updateArtist, deleteArtist, toggleFavoriteArtist };
