const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '23fe8b5ed56a4ebba6746af21b8a0d0d';
const clientSecret = '3885e8d588a544fa9dab1ae21e35e139';
let accessToken = ' ';
let spotifyApi = new SpotifyWebApi({});
const TRACK_ENDPOINT='/tracks';
const BAND_ENDPOINT='/bands';
const ALBUM_ENDPOINT='/albums';


module.exports = function (router) {
    router.get(`/${TRACK_ENDPOINT}`, async ({query}, res, next) => {
        axios({
        url: 'https://accounts.spotify.com/api/token',
        method: 'post',
        params: {
            grant_type: 'client_credentials'
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
            username: clientId,
            password: clientSecret
        }
    }).then(function (response) {
        accessToken = response.data.access_token;
        spotifyApi.setAccessToken(accessToken);
        console.log(response.data.access_token);
        spotifyApi.searchTracks(query).then(function (data) {
            console.log('Search by ' + query, data.body.tracks.items);
        }, function (err) {
            console.error(err);
        });
        res.status(200);
    }).catch(function (error) {
    });
    });
}
