import { favoriteArtists, updateArtistGrid} from "./frontApp.js";
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
  const form = event.target;

  const artistName = form.artistName.value;
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const genres = genresArr();
  const labels = labelsArr();
  const website = form.website.value;
  const image = form.image.value;
  const shortDescription = form.shortDescription.value;

  function genresArr() {
    let arr = [];
    const str = form.genres.value;

    arr = str.split(", ");

    return arr;
  }

  function labelsArr() {
    let arr = [];
    const str = form.labels.value;

    arr = str.split(", ");

    return arr;
  }

  // update artist
  const updatedArtist = { artistName, name, birthdate, activeSince, genres, labels, website, image, shortDescription };
  const updateAsJson = JSON.stringify(updatedArtist);
  const response = await fetch(`${endpoint}/artists/${selectedArtist.id}`, {
    method: "PUT",
    body: updateAsJson,
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    // if success, update the artist grid
    console.log("artist updated");
    updateArtistGrid();
  }
}

// ----- DELETE ARTIST ----- \\
async function deleteArtist(id) {
  console.log("artist deleted");
  console.log(id);
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    // if success, update the artists grid
    updateArtistGrid();
  }
}

// ----- FAVORITE ARTIST ----- \\
async function createFavoriteArtist(artist, id) {
  console.log(favoriteArtists);
  console.log(id);

  let test = favoriteArtists.find((artist) => artist.id === id);
  console.log(test);

  if (typeof test === "undefined") {
    console.log("no similarities");
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

export { getArtists, getFavArtists, createArtist, updateArtist, deleteArtist, createFavoriteArtist };
