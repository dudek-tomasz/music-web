const Joi = require('joi');
const ALBUM_ENDPOINT = 'albums';
const BAND_ENDPOINT = 'bands';
const USER_ENDPOINT = 'users';
const authGuard = require('../../auth.guard');
const authService = require('../../auth.service');
const adminId = "5e302faed25650441cf7e8cb";
const adminPass = "admin123";

module.exports = function (router) {
    router.post(`/${ALBUM_ENDPOINT}`, authGuard, async (req, res) => {
        const decodedTokenData = await authService.decodeTokenFromHeaders(req);
        if (decodedTokenData.data.userId === adminId) {
            let newAlbum = new Album();
            newAlbum.name = req.body.name;
            newAlbum.category = req.body.category;
            newAlbum.description = req.body.description;
            newAlbum.save((error, result) => {
                if (error) {
                    res.status(400).json({error: error});
                } else {
                    res.status(200).json({
                        message: "New album created!",
                        newAlbum: newAlbum
                    });
                    console.log("Dodano jeden element")
                }
            });
        }
    });
    router.get(`/${ALBUM_ENDPOINT}`, async ({query}, res, next) => {
        const qValidtor = Joi.object({
            limit: Joi.number().integer().max(5).default(5),
            skip: Joi.number().integer().default(0),
            category: Joi.string().valid(['Rock/Metal', 'POP', 'HIP-HOP/RAP/TRAP', 'DANCE/ELECTRONIC/HOUSE', 'CLASICAL/OPERA', 'R&B', 'SOUL/BLUES']),
            name: Joi.string()
        }).validate(query);
        if (qValidtor.error) {
            return res.status(400).end();
        }
        const {skip, limit, category, name} = qValidtor.value;
        const mongoQuery = {};
        if (category) mongoQuery.category = category;
        if (name) mongoQuery.name = name;
        let results = [];
        try {
            results = await Promise.all([
                Album.find(mongoQuery).skip(skip).limit(limit),
                Album.countDocuments(mongoQuery)
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

    router.delete(`/${ALBUM_ENDPOINT}/:id`, authGuard, async (req, res) => {
        const id = req.params.id;

        myQuery = {_id: id};
        const decodedTokenData = await authService.decodeTokenFromHeaders(req);
        if (decodedTokenData.data.userId === adminId) {
            Album.findOne(details, (err, obj) => {
                if (err) {
                    throw err;
                } else {
                    Album.deleteOne(myQuery, function (err, obj) {
                        if (err) throw err;
                        console.log("1 album deleted");
                    });
                }
            })
        }
    });

    router.get(`/${ALBUM_ENDPOINT}/:id`, (req, res) => {
        const id = req.params.id;

        Album.findById(id)
            .exec()
            .then(doc => {
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
    router.get(`/${USER_ENDPOINT}/:id/${ALBUM_ENDPOINT}`, (req, res) => {
        const id = req.params.id;

        Album.find({usersFavList: {$in: [id]}}).exec(function (error, result) {
            if (error) {
                res.status(404).json({message: "No valid entry found for provided ID"});
            } else {
                res.status(200).json(result);
            }
        });
    });
    router.get(`/${BAND_ENDPOINT}/:id/${ALBUM_ENDPOINT}`, (req, res) => {
        const id = req.params.id;
        Album.find({bandId: id}).exec(function (error, result) {
            if (error) {
                res.status(404).json({message: "No valid entry found for provided ID"});
            } else {
                res.status(200).json(result);
            }
        });
    });
}
