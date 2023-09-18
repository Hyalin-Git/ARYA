const nodemailer = require("nodemailer");

exports.sendEmail = async (email, subject, text) => {
	const transport = {
		host: `${process.env.HOST}`,
		port: 587,
		secure: false,
		auth: {
			user: `${process.env.USER}`,
			pass: `${process.env.PASS}`,
		},
		tls: {
			rejectUnauthorized: false,
		},
	};
	const message = {
		from: `${process.env.USER}`,
		to: email,
		subject: subject,
		html: text,
	};
	try {
		const transporter = nodemailer.createTransport(transport);

		const sent = await new Promise((resolve, reject) => {
			transporter.sendMail(message, (err, data) => {
				if (err) {
					reject(err);
					throw err;
				}
				resolve(data);
			});
		});

		return sent;
	} catch (err) {
		console.log(err);
	}
};
