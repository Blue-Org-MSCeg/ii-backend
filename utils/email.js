const nodemailer = require('nodemailer');

const sendEmail = (options) => {
	// 1) create a transporter
	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.APP_PASSWORD,
		},
	});

	// 2) define the email options
	const mailOptions = {
		from: 'Raja <vickyclans3@gmail.com>',
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	// 3) send the mail
	transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
