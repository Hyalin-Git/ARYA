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
		text: text,
	};
	try {
		const transporter = nodemailer.createTransport(transport);

		await transporter.sendMail(message, (err, data) => {
			if (err) {
				return console.log(err);
			}
			console.log(data);
		});

		console.log("Email envoyé");
	} catch (err) {
		console.log(err);
	}
};
