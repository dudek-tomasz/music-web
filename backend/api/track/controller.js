const Track = require('./schema');
const Joi = require('joi');
const TRACK_ENDPOINT = 'tracks';
const USER_ENDPOINT = 'users';
const ALBUM_ENDPOINT = 'albums';
const BAND_ENDPOINT = 'bands';
const authGuard = require('../../auth.guard');
const authService = require('../../auth.service');
const ObjectID = require('mongodb').ObjectID;

const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '23fe8b5ed56a4ebba6746af21b8a0d0d';
const clientSecret = '3885e8d588a544fa9dab1ae21e35e139';
let accessToken = ' ';
let spotifyApi = new SpotifyWebApi({});

const adminId = "5e302faed25650441cf7e8cb";
const adminPass = "admin123";

module.exports = function (router) {
    router.get(`/${TRACK_ENDPOINT}`, async ({query},res, next) => {
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
        })
            .then((response)=> {
            const qValidtor = Joi.object({
                name: Joi.string()
            })
                .validate(query);
                if (qValidtor.error) {
                    return res.status(400).end();
                }

            const {name} = qValidtor.value;
            accessToken = response.data.access_token;
            spotifyApi.setAccessToken(accessToken);

            spotifyApi.searchTracks(name).then((data)=>{
                let tracks = [];
                let results = data.body.tracks.items;
                results.forEach(el=>{
                    let track = {};
                    track.spotifyId = el.id;
                    track.name = el.name;
                    track.href = el.href;
                    track.albumId = el.album.id;
                    track.albumName = el.album.name;
                    track.bandId = el.artists[0].id;
                    track.bandName = el.artists[0].name;
                    track.imgUrl = el.album.images[1].url;
                    track.previewURL = el.preview_url;
                    tracks.push(track);
                })

                console.log('Search by ' + name, tracks);
                res.send(tracks);
            },
                (err)=> {
                console.error(err);
                });

            res.status(200);
        })
            .catch(function (error) {});
    });

    router.get(`/${TRACK_ENDPOINT}/:id`, async (req, res, next) => {
        const id = req.params.id;
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
        })
            .then((response)=> {
                accessToken = response.data.access_token;
                spotifyApi.setAccessToken(accessToken);

                spotifyApi.getTrack(id).then((data)=>{
                        let results = data.body;
                            let track = {};
                            track.spotifyId = results.id;
                            track.name = results.name;
                            track.href = results.href;
                            track.albumId = results.album.id;
                            track.albumName = results.album.name;
                            track.bandId = results.artists[0].id;
                            track.bandName = results.artists[0].name;
                            track.imgUrl = results.album.images[1].url;
                            track.previewURL = results.preview_url;
                        console.log('Search by ' + id, track);
                        res.send(track);
                    },
                    (err)=> {
                        console.error(err);
                    });

                res.status(200);
            })
            .catch(function (error) {});
    });
    // -------------------Use when you've got your own music database---------------------------
    /*
    router.get(`/${TRACK_ENDPOINT}`, async ({query}, res, next) => {
        const qValidtor = Joi.object({
            limit: Joi.number().integer().max(5).default(5),
            skip: Joi.number().integer().default(0),
            name: Joi.string()
        }).validate(query);

        if (qValidtor.error) {
            return res.status(400).end();
        }

        const {skip, limit, name} = qValidtor.value;
        const mongoQuery = {};

        if (name) {
            mongoQuery.name = name;
        }

        let results = [];

        try {
            results = await Promise.all([
                Track
                    .find({name: new RegExp(mongoQuery.name, 'i')})
                    .skip(skip)
                    .limit(limit),
                Track.countDocuments(mongoQuery)
            ]);
        } catch (err) {
            return next(err)
        }

        return res
            .status(200)
            .set('X-Total-Count', results[1])               // Ile jest wszystkich potencjalnych wynikow pasujacych do query
            .set('X-Result-Count', results[0].length)       // Ile zwrocono wynikow, opcjonalne, ale przydatne jesli klient nie zna limitu domyslnego
            .json(results[0]);
    });


    //Usuwanie po id
    router.delete(`/${TRACK_ENDPOINT}/:id`, authGuard, async (req, res) => {
        const decodedTokenData = await authService.decodeTokenFromHeaders(req);
        if (decodedTokenData.data.userId === adminId) {
            const id = req.params.id;
            const details = {'_id': new ObjectID(id)};
            let myQuery = {_id: id};

            Track.findOne(details, (err, obj) => {
                if (err) {
                    res.status(404).json({message: "No valid entry found for provided ID"})
                } else {
                    Track.deleteOne(myQuery, function (err, obj) {
                        if (err) throw err;
                        console.log("1 document deleted");
                    });
                }
            })
        }
    });

    //Dodawanie tracka  ***********cos z autentykacja**************
    router.post(`/${TRACK_ENDPOINT}`, authGuard, async (req, res) => {
        const decodedTokenData = await authService.decodeTokenFromHeaders(req);
        // if(decodedTokenData.data.userId===adminId) {
        let newTrack = new Track();
        newTrack.name = req.body.name;
        newTrack.description = req.body.description;
        newTrack.bandId = req.body.bandId;
        newTrack.save((error, result) => {
            if (error) {
                res.status(400).json(error);
            } else {
                res.status(200).json({
                    message: "New track created!",
                    track: newTrack
                });
                console.log("Dodano jeden element")
            }
        });
        // }
    });

    //znajdowanie tracka po id
    router.get(`/${TRACK_ENDPOINT}/:id`, (req, res) => {
        const id = req.params.id;
        Track.findById(id)
            .exec()
            .then(doc => {
                console.log("From Database", doc);
                if (doc) {
                    res.status(200).json(doc);
                } else {
                    res.status(404).json({message: "No valid entry found for provided ID"});
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            });
    });


    //aktualizowanie tracka
    router.put(`/${TRACK_ENDPOINT}/:id`, authGuard, async (req, res) => {
        const decodedTokenData = await authService.decodeTokenFromHeaders(req);
        if (decodedTokenData.data.userId === adminId) {
            Track.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
                if (err) {
                    res.status(404).json({message: "No valid entry found for provided ID"});
                }
                res.json(post);
            });
        }
    });

    //Filtrowanie listy po ulubionych
    router.get(`/${USER_ENDPOINT}/:id/${TRACK_ENDPOINT}`, (req, res) => {
        const id = req.params.id;
        Track.find({usersFavList: {$in: [id]}}).exec(function (error, result) {
            if (error) {
                res.status(400).json({message: "No entries found!"});
            } else {
                res.status(200).json(result);
            }
        });
    });

    //Filtrowanie listy po albumie
    router.get(`/${ALBUM_ENDPOINT}/:id/${TRACK_ENDPOINT}`, (req, res) => {
        const id = req.params.id;
        Track.find({albumId: id}).exec(function (error, result) {
            if (error) {
                res.status(400).json({message: "No valid entry found for provided ID"});
            } else {
                res.status(200).json(result);
            }
        });
    });

    //Filtrowanie listy po bandzie
    router.get(`/${BAND_ENDPOINT}/:id/${TRACK_ENDPOINT}`, (req, res) => {
        const id = req.params.id;

        Track.find({bandId: id}).exec(function (error, result) {
            if (error) {
                res.status(400).json({message: "No valid entry found for provided ID"});
            } else {
                res.status(200).json(result);
            }
        });
    });*/
};
