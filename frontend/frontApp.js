"use strict";

//Imports...

const endpoint = "http://localhost:3000";
// const endpoint = "../backend/data/artists.json";

window.addEventListener("load", startApp());

function startApp() {
  console.log("test!");
  updateArtistGrid();

  //eventlisteners
  document.querySelector("#create-artist-btn").addEventListener("click", showCreateArtist);
  document.querySelector("#form-create-artist").addEventListener("submit", createArtist);
}

async function updateArtistGrid() {
  const artists = await getArtists();
  console.log(artists);
  showArtists(artists);
}

//get artist (module rest)
async function getArtists() {
  const response = await fetch(`${endpoint}/artists`);
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
                          </article>
      `;

  document.querySelector("#artists-container").insertAdjacentHTML("beforeend", htmlPost);

  // ---------- Eventlisteners on child elements---------- \\
  //todo
  document.querySelector("#artists-container article:last-child").addEventListener("click", showDetails);

  document.querySelector("#artists-container article:last-child .btn-update").addEventListener("click", (event) => {
    event.stopPropagation();
    updatePostClicked();
  });
  document.querySelector("#artists-container article:last-child .btn-delete").addEventListener("click", (event) => {
    event.stopPropagation();
    deletePostClicked();
  });

  function showDetails() {
    document.querySelector("#detail-view-artistname").textContent = object.artistName;
    document.querySelector("#detail-view-name").textContent = object.name;
    document.querySelector("#detail-view-birthdate").textContent = object.birthdate;
    document.querySelector("#detail-view-description").textContent = object.shortDescription;
    // todo - add more info? And make some css

    document.querySelector("#dialog-detail-view").showModal();
  }
}

function updatePostClicked() {
  //todo
}

function deletePostClicked() {
  //todo
}

function showCreateArtist(event) {
  event.preventDefault();
  console.log("create clicked!");
  document.querySelector("#dialog-create-artist").showModal();
}

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
  
  // create a new user
  const newArtist = { artistName, name, birthdate, activeSince, genres, labels, website, image, shortDescription };
  const artistAsJson = JSON.stringify(newArtist);
  const response = await fetch(`${endpoint}/artists`, {
    method: "POST",
    body: artistAsJson,
    headers: { "Content-Type": "application/json" },
  });
  
  if (response.ok) {
    // if success, update the users grid
    console.log("artist submitted");
    updateArtistGrid();
  }
}
