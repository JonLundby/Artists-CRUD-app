"use strict";

import express, { json, request, response } from "express";
import fs from "fs/promises";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server initiated on http://localhost:${port}`);
});

app.get("/", (request, response) => {
  response.send("hello express");
});

//GET artists
app.get("/artists", async (request, response) => {
  const data = await fs.readFile("./data/artists.json");
  const artists = JSON.parse(data);
  response.json(artists);
});

//GET artists ON SPECIFIC ID
app.get("/artists/:id", async (request, response) => {
  const id = Number(request.params.id);

  const data = await fs.readFile("./data/artists.json");
  const artists = JSON.parse(data);

  let artistToGet = artists.find((artist) => artist.id === id);

  if (!artistToGet) {
    response.status(404);
    return response.json("404, Id does not exist");
  } else {
    response.json(artistToGet);
  }
});

//POST/CREATE new artist
app.post("/artists", async (request, response) => {
  const newArtist = request.body;
  newArtist.id = new Date().getTime();

  const data = await fs.readFile("./data/artists.json");
  const artists = JSON.parse(data);
  artists.push(newArtist);
  // console.log(newArtist);
  fs.writeFile("./data/artists.json", JSON.stringify(artists, null, 2));
  response.json(artists);
});

//PUT/UPDATE artist
app.put("/artists/:id", async (request, response) => {
  const id = Number(request.params.id);

  const data = await fs.readFile("./data/artists.json");
  const artists = JSON.parse(data);

  let artistToUpdate = artists.find((artist) => artist.id === id);

  const body = request.body;

  artistToUpdate.artistName = body.artistName;
  artistToUpdate.name = body.name;
  artistToUpdate.birthdate = body.birthdate;
  artistToUpdate.activeSince = body.activeSince;
  artistToUpdate.genres = body.genres;
  artistToUpdate.labels = body.labels;
  artistToUpdate.website = body.website;
  artistToUpdate.image = body.image;
  artistToUpdate.shortDescription = body.shortDescription;

  fs.writeFile("./data/artists.json", JSON.stringify(artists, null, 2));
  response.json(artists);
});

//DELETE artist
app.delete("/artists/:id", async (request, response) => {
  const id = Number(request.params.id);

  const data = await fs.readFile("./data/artists.json");
  const artists = JSON.parse(data);

  const newArtists = artists.filter((artist) => artist.id !== id);
  fs.writeFile("./data/artists.json", JSON.stringify(newArtists, null, 2));
  // console.log(newArtists.lenght)
  // if (!newArtists > 1) {
  //   response.status(404);
  //   return response.json("Cannot delete, id does not exist")
  // } else {
  //   response.status(200)
  // }
  response.json();
});

//GET FAVORITE ARTISTS
app.get("/favorites", async (request, response) => {
  const data = await fs.readFile("./data/favorites.json");
  const favorites = JSON.parse(data);
  response.json(favorites);
});

//FAVORITE CREATE
app.post("/favorites", async (request, response) => {
  const newArtist = request.body;

  const data = await fs.readFile("./data/favorites.json");
  const artists = JSON.parse(data);
  artists.push(newArtist);

  fs.writeFile("./data/favorites.json", JSON.stringify(artists, null, 2));

  response.json(artists);
});

//FAVORITE DELETE
app.delete("/favorites/:id", async (request, response) => {
  const id = Number(request.params.id);

  const data = await fs.readFile("./data/favorites.json");
  const artists = JSON.parse(data);

  const newArtists = artists.filter((artist) => artist.id !== id);
  fs.writeFile("./data/favorites.json", JSON.stringify(newArtists, null, 2));

  response.json();
});
