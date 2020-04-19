const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const router = express.Router();
const cookieParser = require('cookie-parser');
const users= require('./api/user/controller');
const tracks= require('./api/track/controller');
const bands=require('./api/band/controller');
const grades=require('./api/grade/controller');
const albums=require('./api/album/controller');

const port = 3000;
const mongoUrl = 'mongodb://localhost:27017/MusicWeb';
app.use(bodyParser.json());

users(router);
tracks(router);
bands(router);
albums(router);
grades(router);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

app.use(cors());
app.use(cookieParser());
app.set('trust proxy', true);


mongoose.set('useFindAndModify', false);
mongoose
    .connect(mongoUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }, (err, db) => {
        if (err) {
            console.error('### DATABASE:\t Unable to connect to server... \n### Error:', err.message);
        } else {
            console.log('### DATABASE:\t Connection established to database at url: ', mongoUrl);
        }
    });

app.use(express.static(__dirname));
app.use('/api', router);
app.use('/user',users);
app.use('/track',tracks);
app.use('/band',bands);
app.use('/album',albums);


http.createServer(app).listen(port);
console.log('### SERVER:\t\t Running on port ' + port);

