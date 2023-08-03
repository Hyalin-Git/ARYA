const axios = require("axios");
const moment = require("moment");
const PostModel = require("../models/Post.model");

exports.sendPost = (req, res, next) => {
	axios({
		method: "POST",
		url: "https://api.twitter.com/2/tweets",
		withCredentials: true,
		headers: {
			Authorization:
				"Bearer eFNvdlBmby1wOWVESDJpdWxiemg0WjZOaG1JZ2RNMWNsSWlLX0JiXzdkVjI0OjE2OTEwOTQwNzU2MjA6MToxOmF0OjE",
		},
		data: {
			text: req.body.text,
		},
	})
		.then((response) => {
			res.status(200).send(response.data);
		})
		.catch((err) => res.status(500).send(err));
};

exports.sendScheduledPost = (req, res, next) => {
	let date = moment();
	const year = req.body.year;
	const month = req.body.month;
	const day = req.body.day;
	const hour = req.body.hour;
	const minute = req.body.minute;

	date.set({
		year: year,
		month: month,
		date: day,
		hour: hour,
		minute: minute,
	});

	console.log(req.body.scheduledSendTime);

	const post = new PostModel({
		posterId: req.body.posterId,
		socialMedia: req.body.socialMedia,
		text: req.body.text,
		media: req.body.media,
		scheduledSendTime: date,
	});
	post
		.save()
		.then((post) => {
			res.status(201).send(post);
		})
		.catch((err) => res.status(500).send(err));
};
