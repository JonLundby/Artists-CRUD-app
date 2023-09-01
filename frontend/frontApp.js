"use strict";

//Imports...

// const endpoint = "http://localhost:3000";
const endpoint = "../backend/artists.json";

window.addEventListener("load", startApp());

function startApp() {
  console.log("test!");
  updateArtistGrid();

  //eventlisteners
  document.querySelector("#create-artist-btn").addEventListener("click", showCreateArtist);
}

async function updateArtistGrid() {
  const artists = await getArtists();
  console.log(artists);
  showArtists(artists);
}

//get artist (module rest)
async function getArtists() {
  const response = await fetch(`${endpoint}`);
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
  console.log("create clicked!")
  document.querySelector("#dialog-create-artist").showModal();
}