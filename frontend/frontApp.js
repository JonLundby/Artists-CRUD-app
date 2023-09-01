"use strict";

//Imports...


// const endpoint = "http://localhost:3000";
const endpoint = "../backend/artists.json";

window.addEventListener("load", startApp());

function startApp() {
  console.log("test!");
  updateArtistGrid();
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
    const htmlPost = /*html*/ `
                          <article id="artist-grid-post">
                              <h2>${artist.artistName}<h2>
                              <h3>${artist.name}</h3>
                              <img src=${artist.image} id="grid-img">
                              <p>Born: ${artist.birthdate}</p>
                              <button class="btn-update">Update</button>
                              <button class="btn-delete">Delete</button>
                          </article>
      `;
  
    document.querySelector("#artists-container").insertAdjacentHTML("beforeend", htmlPost);
  
    // ---------- Eventlisteners on child elements---------- \\
    //todo
    // document.querySelector("#artists-container article:last-child").addEventListener("click", showDetails);
  
    // document.querySelector("#artists-container article:last-child .btn-update").addEventListener("click", (event) => {
    //   event.stopPropagation();
    //   updatePostClicked();
    // });
    // document.querySelector("#artists-container article:last-child .btn-delete").addEventListener("click", (event) => {
    //   event.stopPropagation();
    //   deletePostClicked();
    // });
  }

}