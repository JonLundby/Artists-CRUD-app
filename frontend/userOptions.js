import { getArtistsVariable, getFavoriteArtistsVariable, updateArtistGrid, showArtists} from "./frontApp.js";

//Variables
// let artists = getArtistsVariable();
// let favoriteArtists = getFavoriteArtistsVariable();

let showingFavs = false;

let artistsByGenre = [];
let artistsBylabel = [];
let artistsByGenreAndLabel = [];

let favArtistsByGenre = [];
let favArtistsBylabel = [];
let favArtistsByGenreAndLabel = [];

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
function sortBy() {
  let artists = getArtistsVariable();
  let favoriteArtists = getFavoriteArtistsVariable();

  const searchValue = document.querySelector("#sort-by").value;
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
    favArtistsByGenreAndLabel.sort((artist1, artist2) => new Date(artist1.birthdate).getTime() - new Date(artist2.birthdate).getTime()).reverse();
    showArtists(favArtistsByGenreAndLabel);
  }
}

// ----- FILTER ARTISTS ----- \\
function filterArtists() {
  let artists = getArtistsVariable();
  let favoriteArtists = getFavoriteArtistsVariable();

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

export { showingFavs, filterFavOnly, sortBy, filterArtists };
