"use strict";

import express, { json, request, response } from "express";
import fs from "fs/promises"
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

//get artists
app.get("/artists", async (request, response) => {
    const data = await fs.readFile("./data/artists.json");
    const artists = JSON.parse(data); 
    response.json(artists);
});

//post new artist
app.post("/artists", async (request, response) => {
  const newArtist = request.body;
  newArtist.id = new Date().getTime();

  const data = await fs.readFile("./data/artists.json");
  const artists = JSON.parse(data);
  artists.push(newArtist);
  console.log(newArtist);
  fs.writeFile("./data/artists.json", JSON.stringify(artists));
  response.json(artists);
});

// app.put("/artists/:id", (request, response) => {
//     //
// });

// app.delete("/artists/:id", (request, response) => {
//     //
// })