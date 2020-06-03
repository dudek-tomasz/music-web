const Band = require('./schema');
const Joi =require('joi');
const BAND_ENDPOINT = 'bands';
const USER_ENDPOINT = 'users';
const ObjectID = require('mongodb').ObjectID;
const authGuard = require('../../auth.guard');
const authService = require('../../auth.service');
const adminId= "5e302faed25650441cf7e8cb";
const adminPass= "admin123";

const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '23fe8b5ed56a4ebba6746af21b8a0d0d';
const clientSecret = '3885e8d588a544fa9dab1ae21e35e139';
let accessToken = ' ';
let spotifyApi = new SpotifyWebApi({});

module.exports = function (router) {
    router.get(`/${BAND_ENDPOINT}`, async ({query},res, next) => {
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
                spotifyApi.searchArtists(name).then((data)=>{
                        let bands = [];
                        let results = data.body.artists.items;
                        results.forEach(el=>{
                            let band = {};
                            band.spotifyId = el.id;
                            band.name = el.name;
                            band.href = el.href;
                            if(el.images[0]){
                                band.imgUrl = el.images[0].url;
                            } else{
                                band.imgUrl='https://i.ibb.co/ZBJdRG9/mw-logo.png';
                            }
                            bands.push(band);
                        })
                        console.log('Search by ' + name, bands);
                        res.send(bands);
                    },
                    (err)=> {
                        console.error(err);
                    });

                res.status(200);
            })
            .catch(function (error) {});
    });

    router.get(`/${BAND_ENDPOINT}/:id`, async (req, res, next) => {
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

                spotifyApi.getArtist(id).then((data)=>{
                        let results = data.body;
                        let band = {};
                        band.spotifyId =results.id;
                        band.name =results.name;
                        band.href =results.href;
                        if(results.images[0]){
                            band.imgUrl =results.images[0].url;
                        } else{
                            band.imgUrl='https://i.ibb.co/ZBJdRG9/mw-logo.png';
                        }
                        console.log('Search by ' + id, band);
                        res.send(band);
                    },
                    (err)=> {
                        console.error(err);
                    });

                res.status(200);
            })
            .catch(function (error) {});
    });
    // -------------------Use when you've got your own music database---------------------------
 /*   router.get(`/${BAND_ENDPOINT}`, async ({query}, res, next) => {
        const qValidtor = Joi.object({
            limit: Joi.number().integer().max(15).default(10),
            skip: Joi.number().integer().default(0),
            name: Joi.string()
        }).validate(query);

        if (qValidtor.error) {
            return res.status(400).end();
        }

        const {skip, limit,name} = qValidtor.value;
        const mongoQuery = {};

        if (name){
            mongoQuery.name = name
        };

        let results = [];
        try {
            results = await Promise.all([
                Band
                    .find({name: new RegExp(mongoQuery.name, 'i')})
                    .skip(skip)
                    .limit(limit),
                Band.countDocuments(mongoQuery)
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
    router.post(`/${BAND_ENDPOINT}`, authGuard, async(req, res) => {
        const decodedTokenData = await authService.decodeTokenFromHeaders(req);
        if(decodedTokenData.data.userId===adminId) {
            let newBand = new Band();
            newBand.name = req.body.name;
            newBand.description = req.body.description;
            newBand.save((error, result) => {
                if (error) {
                    res.status(400).json(error);
                } else {
                    res.status(200).json({
                        message: "New band created!",
                        band: newBand
                    });
                    console.log("Dodano jeden element")
                }
            });
        }
    });
    router.delete(`/${BAND_ENDPOINT}/:id`, authGuard, async (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        let myQuery = {_id: id};
        const decodedTokenData = await authService.decodeTokenFromHeaders(req);
        if(decodedTokenData.data.userId===adminId) {
            Band.findOne(details, (err, obj) => {
                 if(obj) {
                     if (err) {
                         throw err;
                     }else
                    Band.deleteOne(myQuery, function (err, obj) {
                        if (err) throw err;
                        res.status(200).json({message:"Successfully deleted!"});
                    });
                } else res.status(404).json({message: "No valid entry found for provided ID"});

            })
        }
    });

    router.get(`/${BAND_ENDPOINT}/:id`, (req, res) => {
        const id = req.params.id;
        Band.findById(id)
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

    router.put(`/${BAND_ENDPOINT}/:id`, authGuard, async (req, res) => {
        const decodedTokenData = await authService.decodeTokenFromHeaders(req);
        if(decodedTokenData.data.userId===adminId) {
            Band.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
                if (err) {
                    res.status(404).json({message: "No valid entry found for provided ID"});
                    throw err;
                }
                res.json(post);
            });
        }
    });

    router.get(`/${USER_ENDPOINT}/:id/${BAND_ENDPOINT}`, (req, res) => {
        const id = req.params.id;
        Band.find({usersFavList: {$in: [id]}}).exec(function (error, result) {
            if (error) {
                res.status(400).json({message: "No entries found"});
            } else {
                res.status(200).json(result);
            }
        });
    });
*/
}
