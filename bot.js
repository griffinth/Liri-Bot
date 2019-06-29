require("dotenv").config();


const axios = require("axios");
const fs = require("fs");
const keys = require("./spotify.js");
const moment = require("moment");
const Spotify = require("node-spotify-api");

const spotify = new Spotify(keys.spotify);


const command = process.argv[2];
const input = process.argv.slice(3).join("+");


const processCommand = function (command, input) {
    switch (command) {

        case "concert-this":

            axios

                .get(
                    "https://rest.bandsintown.com/artists/" +
                    input +
                    "/events?app_id=codingbootcamp"
                )
                //  pull back the response from bandsintown
                .then(function (response) {

                    const eventArray = response.data;
                    eventArray.forEach(function (response) {

                        const formattedDate = moment(response.datetime).format(
                            "MM/DD/YYYY"
                        );

                        console.log(`${response.venue.name}
                        ${response.venue.city}, ${response.venue.region}
                        ${formattedDate}
                        __________________________________________________`);

                        err => {
                            if (err) console.log(`Could not log due to ${err.message}`);
                        }
                    });
                });
            break;

        case "spotify-this-song":
            if (input === "") {

                input = "The Search";
            }

            spotify.search({
                    type: "track",
                    query: `'${input}'`,
                    limit: 1
                },

                function (err, data) {
                    if (err) {
                        return console.log("Error occurred: " + err);
                    }

                    console.log(`Artist: ${data.tracks.items[0].album.artists[0].name}
                                Song: ${data.tracks.items[0].name}`);

                    const previewURL = data.tracks.items[0].preview_url;
                    console.log(
                        previewURL === null ?
                        "Preview not available for this song" :
                        `Preview: ${previewURL}`);

                    console.log(`Album: ${data.tracks.items[0].album.name}`);
                }
            );
            break;

        case "movie-this":
            if (input === "") {

                input = "The Matrix";
            }

            axios

                .get(
                    "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=e8cc34df"
                )

                .then(function (response) {
                    console.log(`Title: ${response.data.Title}
                    Release Year: ${response.data.Year}
                    IMDB Rating: ${response.data.imdbRating}
                    Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}
                    Country: ${response.data.Country}
                    Language: ${response.data.Language}
                    Plot: ${response.data.Plot}
                    Actors: ${response.data.Actors}`);
                });
            break;

        case "do-what-it-says":
            fs.readFile("random.txt", "utf8", function (err, data) {
                if (err) throw err;

                var randomText = data.split(",");

                if (randomText.length == 2) {
                    processCommand(randomText[0], randomText[1]);
                } else if (randomText.length == 1) {
                    processCommand(randomText[0]);
                }
            });
    }
};

processCommand(command, input);