"use strict";

//Imports...
import { getArtists, getFavArtists, createArtist, updateArtist, deleteArtist, toggleFavoriteArtist } from "./rest.js";

//GLOBAL VARIABLES
let artists;
let favoriteArtists;
let selectedArtist;
let showingFavs = false;
let artistsByGenre = [];
let artistsBylabel = [];
let artistsByGenreAndLabel = [];
let favArtistsByGenre = [];
let favArtistsBylabel = [];
let favArtistsByGenreAndLabel = [];

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
    document.querySelector("#sort-by").value = "none";
    document.querySelector("#filter-genre").value = "none";
    document.querySelector("#filter-label").value = "none";
    showArtists(artists);
  } else {
    document.querySelector("#sort-by").value = "none";
    document.querySelector("#filter-genre").value = "none";
    document.querySelector("#filter-label").value = "none";
    showArtists(favoriteArtists);
  }
  console.log("GRID WAS UPDATED!!");
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
    console.log(object.id);

    form.setAttribute("data-id", object.id);
    console.log(form);

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
  const searchValue = document.querySelector("#sort-by").value;
  // console.log(`sorting was changed to ${value}`);
  const favCheck = document.querySelector("#fav-only");

  let valueGenre = document.querySelector("#filter-genre").value;
  let valueLabel = document.querySelector("#filter-label").value;

  // ----- FILTERING NORMAL LIST ----- \\
  //searchValue, 0, 0
  if (!favCheck.checked && searchValue === "none" && valueGenre === "none" && valueLabel === "none") {
    showArtists(artists);
  } else if (!favCheck.checked && searchValue === "artist-name" && valueGenre === "none" && valueLabel === "none") {
    artists.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(artists);
  } else if (!favCheck.checked && searchValue === "civil-name" && valueGenre === "none" && valueLabel === "none") {
    artists.sort((artist1, artist2) => artist1.name.localeCompare(artist2.name));
    showArtists(artists);
  } else if (!favCheck.checked && searchValue === "birthdate-ascending" && valueGenre === "none" && valueLabel === "none") {
    artists.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime());
    showArtists(artists);
  } else if (!favCheck.checked && searchValue === "birthdate-descending" && valueGenre === "none" && valueLabel === "none") {
    artists.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime()).reverse();
    showArtists(artists);
  }
  //searchValue, 1, 0
  else if (!favCheck.checked && searchValue === "none" && valueGenre !== "none" && valueLabel === "none") {
    artistsByGenre.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(artistsByGenre);
  } else if (!favCheck.checked && searchValue === "artist-name" && valueGenre !== "none" && valueLabel === "none") {
    artistsByGenre.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(artistsByGenre);
  } else if (!favCheck.checked && searchValue === "civil-name" && valueGenre !== "none" && valueLabel === "none") {
    artistsByGenre.sort((artist1, artist2) => artist1.name.localeCompare(artist2.name));
    showArtists(artistsByGenre);
  } else if (!favCheck.checked && searchValue === "birthdate-ascending" && valueGenre !== "none" && valueLabel === "none") {
    artistsByGenre.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime());
    showArtists(artistsByGenre);
  } else if (!favCheck.checked && searchValue === "birthdate-descending" && valueGenre !== "none" && valueLabel === "none") {
    artistsByGenre.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime()).reverse();
    showArtists(artistsByGenre);
  }
  //searchValue, 0, 1
  else if (!favCheck.checked && searchValue === "none" && valueGenre === "none" && valueLabel !== "none") {
    artistsBylabel.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(artistsBylabel);
  } else if (!favCheck.checked && searchValue === "artist-name" && valueGenre === "none" && valueLabel !== "none") {
    artistsBylabel.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(artistsBylabel);
  } else if (!favCheck.checked && searchValue === "civil-name" && valueGenre === "none" && valueLabel !== "none") {
    artistsBylabel.sort((artist1, artist2) => artist1.name.localeCompare(artist2.name));
    showArtists(artistsBylabel);
  } else if (!favCheck.checked && searchValue === "birthdate-ascending" && valueGenre === "none" && valueLabel !== "none") {
    artistsBylabel.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime());
    showArtists(artistsBylabel);
  } else if (!favCheck.checked && searchValue === "birthdate-descending" && valueGenre === "none" && valueLabel !== "none") {
    artistsBylabel.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime()).reverse();
    showArtists(artistsBylabel);
  }
  //searchValue, 1, 1
  else if (!favCheck.checked && searchValue === "none" && valueLabel !== "none" && valueGenre !== "none") {
    artistsByGenreAndLabel.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(artistsByGenreAndLabel);
  } else if (!favCheck.checked && searchValue === "artist-name" && valueLabel !== "none" && valueGenre !== "none") {
    artistsByGenreAndLabel.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(artistsByGenreAndLabel);
  } else if (!favCheck.checked && searchValue === "civil-name" && valueLabel !== "none" && valueGenre !== "none") {
    artistsByGenreAndLabel.sort((artist1, artist2) => artist1.name.localeCompare(artist2.name));
    showArtists(artistsByGenreAndLabel);
  } else if (!favCheck.checked && searchValue === "birthdate-ascending" && valueLabel !== "none" && valueGenre !== "none") {
    artistsByGenreAndLabel.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime());
    showArtists(artistsByGenreAndLabel);
  } else if (!favCheck.checked && searchValue === "birthdate-descending" && valueLabel !== "none" && valueGenre !== "none") {
    console.log("here...");
    artistsByGenreAndLabel.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime()).reverse();
    showArtists(artistsByGenreAndLabel);
  }
  // ----- FILTERING NORMAL LIST ----- \\
  //searchValue, 0, 0
  if (favCheck.checked && searchValue === "none" && valueGenre === "none" && valueLabel === "none") {
    showArtists(favoriteArtists);
  } else if (favCheck.checked && searchValue === "artist-name" && valueGenre === "none" && valueLabel === "none") {
    favoriteArtists.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(favoriteArtists);
  } else if (favCheck.checked && searchValue === "civil-name" && valueGenre === "none" && valueLabel === "none") {
    favoriteArtists.sort((artist1, artist2) => artist1.name.localeCompare(artist2.name));
    showArtists(favoriteArtists);
  } else if (favCheck.checked && searchValue === "birthdate-ascending" && valueGenre === "none" && valueLabel === "none") {
    favoriteArtists.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime());
    showArtists(favoriteArtists);
  } else if (favCheck.checked && searchValue === "birthdate-descending" && valueGenre === "none" && valueLabel === "none") {
    favoriteArtists.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime()).reverse();
    showArtists(favoriteArtists);
  }
  //searchValue, 1, 0
  else if (favCheck.checked && searchValue === "none" && valueGenre !== "none" && valueLabel === "none") {
    favArtistsByGenre.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(favArtistsByGenre);
  } else if (favCheck.checked && searchValue === "artist-name" && valueGenre !== "none" && valueLabel === "none") {
    favArtistsByGenre.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(favArtistsByGenre);
  } else if (favCheck.checked && searchValue === "civil-name" && valueGenre !== "none" && valueLabel === "none") {
    favArtistsByGenre.sort((artist1, artist2) => artist1.name.localeCompare(artist2.name));
    showArtists(favArtistsByGenre);
  } else if (favCheck.checked && searchValue === "birthdate-ascending" && valueGenre !== "none" && valueLabel === "none") {
    favArtistsByGenre.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime());
    showArtists(favArtistsByGenre);
  } else if (favCheck.checked && searchValue === "birthdate-descending" && valueGenre !== "none" && valueLabel === "none") {
    favArtistsByGenre.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime()).reverse();
    showArtists(favArtistsByGenre);
  }
  //searchValue, 0, 1
  else if (favCheck.checked && searchValue === "none" && valueGenre === "none" && valueLabel !== "none") {
    favArtistsBylabel.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(favArtistsBylabel);
  } else if (favCheck.checked && searchValue === "artist-name" && valueGenre === "none" && valueLabel !== "none") {
    favArtistsBylabel.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(favArtistsBylabel);
  } else if (favCheck.checked && searchValue === "civil-name" && valueGenre === "none" && valueLabel !== "none") {
    favArtistsBylabel.sort((artist1, artist2) => artist1.name.localeCompare(artist2.name));
    showArtists(favArtistsBylabel);
  } else if (favCheck.checked && searchValue === "birthdate-ascending" && valueGenre === "none" && valueLabel !== "none") {
    favArtistsBylabel.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime());
    showArtists(favArtistsBylabel);
  } else if (favCheck.checked && searchValue === "birthdate-descending" && valueGenre === "none" && valueLabel !== "none") {
    favArtistsBylabel.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime()).reverse();
    showArtists(favArtistsBylabel);
  }
  //searchValue, 1, 1
  else if (favCheck.checked && searchValue === "none" && valueLabel !== "none" && valueGenre !== "none") {
    favArtistsByGenreAndLabel.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(favArtistsByGenreAndLabel);
  } else if (favCheck.checked && searchValue === "artist-name" && valueLabel !== "none" && valueGenre !== "none") {
    favArtistsByGenreAndLabel.sort((artist1, artist2) => artist1.artistName.localeCompare(artist2.artistName));
    showArtists(favArtistsByGenreAndLabel);
  } else if (favCheck.checked && searchValue === "civil-name" && valueLabel !== "none" && valueGenre !== "none") {
    favArtistsByGenreAndLabel.sort((artist1, artist2) => artist1.name.localeCompare(artist2.name));
    showArtists(favArtistsByGenreAndLabel);
  } else if (favCheck.checked && searchValue === "birthdate-ascending" && valueLabel !== "none" && valueGenre !== "none") {
    favArtistsByGenreAndLabel.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime());
    showArtists(favArtistsByGenreAndLabel);
  } else if (favCheck.checked && searchValue === "birthdate-descending" && valueLabel !== "none" && valueGenre !== "none") {
    console.log("here...");
    favArtistsByGenreAndLabel.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime()).reverse();
    showArtists(favArtistsByGenreAndLabel);
  }
}

// ----- FILTER ARTISTS ----- \\
function filterArtists() {
  let valueGenre = document.querySelector("#filter-genre").value;
  let valueLabel = document.querySelector("#filter-label").value;
  // const searchValue = document.querySelector("#sort-by").value;

  if (!showingFavs) {
    artistsByGenre = artists.filter((artist) => artist.genres.includes(valueGenre));
    artistsBylabel = artists.filter((artist) => artist.labels.includes(valueLabel));
    artistsByGenreAndLabel = artists.filter((artist) => artist.genres.includes(valueGenre) && artist.labels.includes(valueLabel));
  } else if (showingFavs) {
    favArtistsByGenre = favoriteArtists.filter((artist) => artist.genres.includes(valueGenre));
    favArtistsBylabel = favoriteArtists.filter((artist) => artist.labels.includes(valueLabel));
    favArtistsByGenreAndLabel = favoriteArtists.filter((artist) => artist.genres.includes(valueGenre) && artist.labels.includes(valueLabel));
  }

  if (!showingFavs && valueGenre === "none" && valueLabel === "none") {
    showArtists(artists);
  } else if (!showingFavs && valueGenre === "none" && valueLabel !== "none") {
    showArtists(artistsBylabel);
  } else if (!showingFavs && valueGenre !== "none" && valueLabel === "none") {
    showArtists(artistsByGenre);
  } else if (!showingFavs && valueGenre !== "none" && valueLabel !== "none") {
    showArtists(artistsByGenreAndLabel);
  }
  //favorites
  else if (showingFavs && valueGenre !== "none" && valueLabel === "none") {
    showArtists(favArtistsByGenre);
  } else if (showingFavs && valueGenre === "none" && valueLabel !== "none") {
    showArtists(favArtistsBylabel);
  } else if (showingFavs && valueGenre !== "none" && valueLabel !== "none") {
    showArtists(favArtistsByGenreAndLabel);
  }
}

export { selectedArtist, favoriteArtists, updateArtistGrid };
