"use strict";

//Imports...

// const endpoint = "../backend/data/artists.json";
const endpoint = "http://localhost:3000";
let artists;
let favoriteArtists;
let artistsFiltered;
let selectedArtist;

window.addEventListener("load", startApp());

function startApp() {
  console.log("test!");
  updateArtistGrid();

  //eventlisteners
  //detail view
  document.querySelector("#create-artist-btn").addEventListener("click", showCreateArtist);

  //create
  document.querySelector("#form-create-artist").addEventListener("submit", createArtist);

  //update
  document.querySelector("#form-update-artist").addEventListener("submit", updateArtist);

  //sort
  document.querySelector("#sort-by").addEventListener("change", sortBy);
  
  //filter
  document.querySelector("#filter-genre").addEventListener("change", filterArtists);
  document.querySelector("#filter-label").addEventListener("change", filterArtists);
  document.querySelector("#fav-only").addEventListener("change", filterFavOnly);
}

async function updateArtistGrid() {
  artists = await getArtists();
  favoriteArtists = await getFavArtists();
  console.log(artists);
  showArtists(artists);
}

//get artist (module rest)
async function getArtists() {
  const response = await fetch(`${endpoint}/artists`);
  const data = await response.json();

  return data;
}

//get FAV artist (module rest)
async function getFavArtists() {
  const response = await fetch(`${endpoint}/favorites`);
  const data = await response.json();

  return data;
}

function showArtists(artists) {
  document.querySelector("#artists-container").innerHTML = "";
  for (const artist of artists) {
    generateArtist(artist);
  }
}

function generateArtist(object) {
  const htmlPost = /*html*/ `
                          <article id="artist-grid-post">
                              <h2>${object.artistName}<h2>
                              <h3>${object.name}</h3>
                              <img src=${object.image} id="grid-img">
                              <p>Born: ${object.birthdate}</p>
                              <button class="btn-update">Update</button>
                              <button class="btn-delete">Delete</button>
                              <button class="btn-favorite">Fav</button>
                          </article>
      `;

  document.querySelector("#artists-container").insertAdjacentHTML("beforeend", htmlPost);

  // ---------- Eventlisteners on child elements---------- \\
  //todo
  document.querySelector("#artists-container article:last-child").addEventListener("click", showDetails);

  document.querySelector("#artists-container article:last-child .btn-update").addEventListener("click", (event) => {
    event.stopPropagation();
    updateArtistClicked();
  });
  document.querySelector("#artists-container article:last-child .btn-delete").addEventListener("click", (event) => {
    event.stopPropagation();
    deleteArtist(object.id);
  });
  document.querySelector("#artists-container article:last-child .btn-favorite").addEventListener("click", (event) => {
    event.stopPropagation();
    createFavoriteArtist(object, object.id);
  });

  function showDetails() {
    document.querySelector("#detail-view-artistname").textContent = object.artistName;
    document.querySelector("#detail-view-name").textContent = object.name;
    document.querySelector("#detail-view-birthdate").textContent = object.birthdate;
    document.querySelector("#detail-view-description").textContent = object.shortDescription;
    // todo - add more info? And make some css

    document.querySelector("#dialog-detail-view").showModal();
  }


  function updateArtistClicked() {
    selectedArtist = object;
    const form = document.querySelector("#form-update-artist");

    form.artistName.value = object.artistName;
    form.name.value = object.name;
    form.birthdate.value = object.birthdate;
    form.activeSince.value = object.activeSince;
    form.genres.value = correctGenresProp();
    form.labels.value = correctLabelsProp();
    form.website.value = object.website;
    form.image.value = object.image;
    form.shortDescription.value = object.shortDescription;

    function correctGenresProp() {
      let str = "";
      str = object.genres.join(", ");

      return str;
    }

    function correctLabelsProp() {
      let str = "";
      str = object.labels.join(", ");

      return str;
    }

    //setting the current objects id to the form
    form.setAttribute("data-id", object.id);

    document.querySelector("#dialog-update-artist").showModal();
  }
  
}

// ----- CREATE ARTIST ----- \\
function showCreateArtist(event) {
  event.preventDefault();
  console.log("create clicked!");
  document.querySelector("#dialog-create-artist").showModal();
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
  console.log("artist deleted")
  console.log(id)
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

  console.log(favoriteArtists)
  console.log(id)
  
  let test = favoriteArtists.find((artist) => artist.id === id)
  console.log(test);

  if (typeof(test) === "undefined") {
    console.log("no similarities");
    const favArtistAsJson = JSON.stringify(artist)
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
  
  // if (!isFav) {
    // const favArtistAsJson = JSON.stringify(artist)
    // await fetch(`${endpoint}/favorites`, {
    //   method: "POST",
    //   body: favArtistAsJson,
    //   headers: { "Content-Type": "application/json" },
    // });
  // } else if (isFav) {
    // await fetch(`${endpoint}/favorites/${id}`, {
    //   method: "DELETE",
    // });
  // }
}

// ----- SORT ARTISTS ----- \\
function filterFavOnly() {
  const favCheck = document.querySelector("#fav-only");
  if (favCheck.checked) {
    showArtists(favoriteArtists);
  } else {
    showArtists(artists);
  }
}

// ----- SORT ARTISTS ----- \\
function sortBy(event) {
  const value = event.target.value;
  // console.log(`sorting was changed to ${value}`);
  const favCheck = document.querySelector("#fav-only");

  if (value === "none" && !favCheck.checked) {
    console.log("sorting by artist none");
    updateArtistGrid();
  } else if (value === "artist-name" && !favCheck.checked) {
    // console.log("sorting by artist name");
    artists.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(artists);
  } else if (value === "civil-name" && !favCheck.checked) {
    // console.log("sorting by civil name");
    artists.sort((artist1, artist2) => artist1.name.localeCompare(artist2.name));
    showArtists(artists);
  } else if (value === "birthdate-ascending" && !favCheck.checked) {
    artists.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime());
    showArtists(artists);
  } else if (value === "birthdate-descending" && !favCheck.checked) {
    artists.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime()).reverse();
    showArtists(artists);
  }
}

// ----- FILTER ARTISTS ----- \\ ------> todo / NOT WORKING
function filterArtists() {
  let valueGenre = document.querySelector("#filter-genre").value;
  let valueLabel = document.querySelector("#filter-label").value;
  console.log(valueGenre)
  
  artistsFiltered = artists.filter(checkFilters);

  function checkFilters(artist) {
    return artist.genres.includes(valueGenre);
  }

  console.log(artistsFiltered);
  // showArtists(artistsFiltered);

}