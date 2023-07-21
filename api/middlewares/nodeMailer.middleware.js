const nodemailer = require("nodemailer");

exports.sendEmail = async (email, subject, text) => {
	const transport = {
		host: `${process.env.HOST}`,
		service: `${process.env.SERVICE}`,
		port: Number(process.env.PORT),
		secure: Boolean(process.env.SECURE),
		auth: {
			user: `${process.env.USER}`,
			pass: `${process.env.PASS}`,
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
					console.log(err);
					reject(err);
				}
				resolve(data);
			});
		});
		return sent;
	} catch (err) {
		console.log(err);
	}
};
