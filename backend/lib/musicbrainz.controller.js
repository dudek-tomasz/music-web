const mbBaseURI = 'http://musicbrainz.org/ws/2/';
const Album = require('../api/album/schema');
const musicBrainzAlbumEndpoint = 'release-group/';
const Track = require('../api/track/schema');
const musicBrainzTrackEndpoint = 'recording/';
const Band = require('../api/band/schema');
const musicBrainzBandEndpoint = 'artist/';
const musicBrainzQueryTag = '?query=';
const axios = require('axios');
module.exports = {
    getAlbumsFromMusicBrainz(query) {
        let releases = [];
        axios.get(`${mbBaseURI}` + musicBrainzAlbumEndpoint + musicBrainzQueryTag + query + '&fmt=json')
            .then((response) => {
                releases = response.data['release-groups'];

                for(let i=0;i<releases.length;i++){
                    if(releases[i+1]!= undefined && releases[i].title==releases[i+1].title && releases[i]["artist-credit"][0].artist.name==releases[i+1]["artist-credit"][0].artist.name){
                        continue;
                    }
                    console.log(releases[i].title);
                    console.log(releases[i].id);
                    console.log(releases[i]["artist-credit"][0].artist.name);
                    console.log(releases[i]["artist-credit"][0].artist.id);
                    console.log('*******************************************');
                }
            });
    },
    getTracksFromMusicBrainz(query){

    },

    getBandsFromMusicBrainz(query){
        let bands=[];
        axios.get(`${mbBaseURI}` + musicBrainzBandEndpoint + musicBrainzQueryTag + query + '&fmt=json')
            .then((response) => {
                bands = response.data.artists;

                for(let i=0;i<bands.length;i++){
                    console.log(bands[i].name);
                    console.log(bands[i].id);
                    console.log(bands[i].disambiguation);
                    console.log(bands[i]["tags"]);
                    console.log('*******************************************');
                }
            });
    }
}
