'use strict';

const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;
app.use(express.json());
app.use(cookieParser());

const sequelize = new Sequelize('chatter', 'root', 'uncrackablePassword', {
	host: 'localhost',
	dialect: 'mysql'
});

class User extends Model {}
User.init({
	username: {
		type: Sequelize.STRING,
		allowNull: false
	},
	passwordHash: {
		type: Sequelize.STRING,
		allowNull:false
	},
	authToken: {
		type: Sequelize.STRING,	
	}
}, {
	indexes: [ { fields: ['authToken'] }, { fields: ['passwordHash'] } ], 
	sequelize,
	modelName: "user"
});


User.sync();

sequelize.authenticate()
	.then(()=>{console.log("Connected to DB")})
	.catch(err => {console.log("Error: " + err)});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});
app.get('/mainPage', (req, res) => {
	if (req.cookies.authToken == "temp") //TODO: get from DB instead
		res.sendFile(path.join(__dirname, "mainPage.html"));
	else{
		res.redirect("/");
		console.log("Redirected to /, because no auth token in cookie");
	}
});

app.post('/login', async (req, res) => {
	const userData = await User.findAll({
		where: { 
			username: req.body.username,
			passwordHash: req.body.password
		}
	});
	if (userData.length === 0)
		res.send({allowed: false});
	else{
		//add auth token to db and send that token to cookies
		res.cookie("authToken","temp").send({allowed: true});
	}
});

app.post('/register', (req, res) => {
	// Creates a user if doesn't exist.
	User.findOrCreate({
		where: {username: req.body.username}, 
		defaults: {passwordHash: req.body.password, authToken: "temp"}
	}).then(([user, created]) => {
		console.log(user.get({plain: true}));
		console.log(created);
		if (created)
			res.cookie("authToken","temp",{maxAge:120000})
			   .send({created: created});
		else{
			res.send({created: created});
		}
	});
});

app.get('/userInfo', (req, res) => {
	//find cookie in db, get relevan info to that cookie
	console.log("User info cookie: " + JSON.stringify(req.cookies));
	res.send({temp:"temp"});
});

app.use(express.static(__dirname));

app.listen(port, () => console.log(`Listening on port ${port}`));
