"use strict";

//Imports...
import { getArtists, getFavArtists, createArtist, updateArtist, deleteArtist, toggleFavoriteArtist } from "./rest.js";

//GLOBAL VARIABLES
let artists;
let favoriteArtists;
// let artistsFiltered;
let selectedArtist;
let showingFavs = false;

window.addEventListener("load", startApp());

function startApp() {
  updateArtistGrid();

  //eventlisteners
  //detail view
  document.querySelector("#create-artist-btn").addEventListener("click", showCreateArtist);

  //create
  document.querySelector("#form-create-artist").addEventListener("submit", createArtist);

  //update
  document.querySelector("#form-update-artist").addEventListener("submit", updateArtist);

  //delete
  document.querySelector("#form-delete-artist").addEventListener("submit", deleteArtist);
  document.querySelector("#form-delete-artist .cancel-delete-btn").addEventListener("click", cancelDelete);

  //sort
  document.querySelector("#sort-by").addEventListener("change", sortBy);
  
  //filters
  document.querySelector("#filter-genre").addEventListener("change", filterArtists);
  document.querySelector("#filter-label").addEventListener("change", filterArtists);
  document.querySelector("#fav-only").addEventListener("change", filterFavOnly);
}

async function updateArtistGrid() {
  artists = await getArtists();
  favoriteArtists = await getFavArtists();
  if (!showingFavs) {
    showArtists(artists);
  } else {
    showArtists(favoriteArtists);
  }
  console.log("GRID WAS UPDATED!!")
}

function showArtists(artists) {
  document.querySelector("#artists-container").innerHTML = "";
  for (const artist of artists) {
    generateArtist(artist);
  }
}

function generateArtist(object) {
  const htmlArtist = /*html*/ `
                          <article id="artist-grid-post">
                              <h2>${object.artistName}<h2>
                              <h3>${object.name}</h3>
                              <img src=${object.image} id="grid-img">
                              <p>Born: ${object.birthdate}</p>
                              <button class="btn-update">Update</button>
                              <button class="btn-delete">Delete</button>
                              <button class="btn-favorite">Favorite</button>
                          </article>
      `;
  
  const htmlFavoriteArtist = /*html*/ `
                          <article id="artist-grid-post">
                              <h2>${object.artistName}<h2>
                              <h3>${object.name}</h3>
                              <img src=${object.image} id="grid-img">
                              <p>Born: ${object.birthdate}</p>
                              <button class="btn-favorite">Remove Favorite</button>
                          </article>
      `;

  if (!showingFavs) {
    document.querySelector("#artists-container").insertAdjacentHTML("beforeend", htmlArtist);
  } else if (showingFavs) {
    document.querySelector("#artists-container").insertAdjacentHTML("beforeend", htmlFavoriteArtist);
  }

  // ---------- Eventlisteners on child elements---------- \\
  document.querySelector("#artists-container article:last-child").addEventListener("click", showDetails);

  if (!showingFavs) {
    document.querySelector("#artists-container article:last-child .btn-update").addEventListener("click", (event) => {
      event.stopPropagation();
      updateArtistClicked();
    });
    
    document.querySelector("#artists-container article:last-child .btn-delete").addEventListener("click", (event) => {
      event.stopPropagation();
      deleteClicked();
    });
  }
  document.querySelector("#artists-container article:last-child .btn-favorite").addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFavoriteArtist(object, object.id);
  });

  //Detal view
  function showDetails() {
    document.querySelector("#detail-view-artistname").textContent = object.artistName;
    document.querySelector("#detail-view-name").textContent = object.name;
    document.querySelector("#detail-view-birthdate").textContent = object.birthdate;
    document.querySelector("#detail-view-activeSince").textContent = object.activeSince;
    document.querySelector("#detail-view-description").textContent = object.shortDescription;
    
    for (let i = 0; i < object.genres.length; i++) {
      const htmlGenre = /*html*/ `<li>${object.genres[i]}</li>`;

      document.querySelector("#detail-view-genres").insertAdjacentHTML("beforeend", htmlGenre);
    }

    for (let i = 0; i < object.labels.length; i++) {
      const htmlLabel = /*html*/ `<li>${object.labels[i]}</li>`;

      document.querySelector("#detail-view-labels").insertAdjacentHTML("beforeend", htmlLabel);
    }

    document.querySelector("#detail-view-website").setAttribute("href", object.website);

    // todo - add more info? And make some css

    document.querySelector("#dialog-detail-view").showModal();
  }


  function updateArtistClicked() {
    //storing the artist/object clicked in selectedArtist variable
    selectedArtist = object;

    //shorthand for updateform
    const form = document.querySelector("#form-update-artist");

    //propagating the update form with the properties of selectedArtist
    form.artistName.value = object.artistName;
    form.name.value = object.name;
    form.birthdate.value = object.birthdate;
    form.activeSince.value = object.activeSince;
    form.genres.value = correctGenresProp();
    form.labels.value = correctLabelsProp();
    form.website.value = object.website;
    form.image.value = object.image;
    form.shortDescription.value = object.shortDescription;

    //converting genres and labels to strings that will later be converted back to an array (see "updateArtist" function in "rest.js")
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
    
    //showing modal window/dialog
    document.querySelector("#dialog-update-artist").showModal();
  }
  
  function deleteClicked(event) {
    const form = document.querySelector("#form-delete-artist");
    selectedArtist = object;
    console.log(object.id)
    
    form.setAttribute("data-id", object.id);
    console.log(form)
    
    document.querySelector("#dialog-delete-artist").showModal();
  }

  
}

function cancelDelete() {
  document.querySelector("#dialog-delete-artist").close();
}

// ----- CREATE ARTIST ----- \\
function showCreateArtist(event) {
  event.preventDefault();
  console.log("create clicked!");
  document.querySelector("#dialog-create-artist").showModal();
}

// ----- FILTER FAV ARTISTS ----- \\
function filterFavOnly() {
  const favCheck = document.querySelector("#fav-only");
  if (favCheck.checked) {
    // showArtists(favoriteArtists);
    showingFavs = true;
  } else {
    // showArtists(artists);
    showingFavs = false;
  }
  updateArtistGrid();
}

// ----- SORT ARTISTS ----- \\
function sortBy(event) {
  const value = event.target.value;
  // console.log(`sorting was changed to ${value}`);
  const favCheck = document.querySelector("#fav-only");

  if (value === "none" && !favCheck.checked) {
    showArtists(artists);
  } else if (value === "artist-name" && !favCheck.checked) {
    artists.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(artists);
  } else if (value === "civil-name" && !favCheck.checked) {
    artists.sort((artist1, artist2) => artist1.name.localeCompare(artist2.name));
    showArtists(artists);
  } else if (value === "birthdate-ascending" && !favCheck.checked) {
    artists.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime());
    showArtists(artists);
  } else if (value === "birthdate-descending" && !favCheck.checked) {
    artists.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime()).reverse();
    showArtists(artists);
  } else if (favCheck.checked && value === "artist-name") {
    favoriteArtists.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(favoriteArtists);
  } else if (favCheck.checked && value === "civil-name") {
    favoriteArtists.sort((artist1, artist2) => artist1.name.localeCompare(artist2.name));
    showArtists(favoriteArtists);
  } else if (favCheck.checked && value === "birthdate-ascending") {
    favoriteArtists.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime());
    showArtists(favoriteArtists);
  } else if (favCheck.checked && value === "birthdate-descending") {
    favoriteArtists.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime()).reverse();
    showArtists(favoriteArtists);
  }
}

// ----- FILTER ARTISTS ----- \\ ------> todo / NOT WORKING
function filterArtists() {
  let valueGenre = document.querySelector("#filter-genre").value;
  let valueLabel = document.querySelector("#filter-label").value;
  let artistsByGenre = [];
  let artistsBylabel = [];
  let artistsByGenreAndLabel = [];

  artistsByGenre = artists.filter((artist) => artist.genres.includes(valueGenre));
  artistsBylabel = artists.filter((artist) => artist.labels.includes(valueLabel));
  artistsByGenreAndLabel = artists.filter((artist) => artist.genres.includes(valueGenre) && artist.labels.includes(valueLabel));
  
  // artistsFiltered = artistsByGenre.concat(artistsBylabel);

  if (valueGenre === "none" && valueLabel === "none") {
    showArtists(artists);
  } else if (valueGenre === "none" && valueLabel !== "none") {
    showArtists(artistsBylabel)
  } else if (valueLabel === "none" && valueGenre !== "none") {
    showArtists(artistsByGenre)
  } else if (valueLabel !== "none" && valueGenre !== "none") {
    showArtists(artistsByGenreAndLabel);
  }
  
}

export { selectedArtist, favoriteArtists, updateArtistGrid };