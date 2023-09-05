"use strict";

//Imports...
import { getArtists, getFavArtists, createArtist, updateArtist, deleteArtist, createFavoriteArtist } from "./rest.js";

//GLOBAL VARIABLES
let artists;
let favoriteArtists;
let artistsFiltered;
let selectedArtist;

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
  // console.log(artists);
  // console.log(favoriteArtists);
  showArtists(artists);
  console.log("GRID WAS UPDATED!!")
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
                              <button class="btn-favorite">favorite</button>
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

    // console.log(form);

    document.querySelector("#dialog-update-artist").showModal();
  }
  
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

export { selectedArtist, favoriteArtists, updateArtistGrid };