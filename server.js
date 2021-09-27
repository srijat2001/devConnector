import props from './config/properties';
import db from './config/db';
import express from 'express';
import users from './routes/api/users';
import profile from './routes/api/profile';
import posts from './routes/api/posts';
import bodyParser from 'body-parser';
import passport from 'passport';

const app = express();

db();


app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);

//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);

app.listen(props.PORT,(err)=>{
    console.log(`Application running on port ${props.PORT}`);
})