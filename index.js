var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// parse application/json
app.use(bodyParser.json({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
	res.send('ok');
});

app.post('/', (req, res) => {
	console.log(req.body);
	res.sendStatus(200);
});

app.post('/api/user', (req, res) => {
	printTime();
	console.log('Login', req.body);
	if (
		req.body === undefined ||
		req.body.rfid === undefined ||
		!(req.body.game_type == 1 || req.body.game_type == 2)
	) {
		res.sendStatus(400);
		return;
	}

	let id = setInterval(() => {
		clearInterval(id);
		res.status(200).json({
			error: false,
			data: '' + req.body.game_type
		});
	}, 1000);
});

app.post('/api/record', (req, res) => {
	printTime();
	console.log('Record', req.body);

	if (req.body === undefined) {
		res.sendStatus(400);
		return;
	}

	const key = req.body.key;
	if (key === undefined) {
		res.sendStatus(400);
		return;
	}

	const game_type = req.body.game_type;
	if (game_type === undefined) {
		res.sendStatus(400);
		return;
	}
	if (game_type !== 1 && game_type !== 2) {
		res.sendStatus(400);
		return;
	}

	let id = setInterval(() => {
		clearInterval(id);
		res.status(200).json({
			error: false,
			data: key
		});
	}, 1000);
});

app.post('/api/uploadphoto/', (req, res) => {
	printTime();
	console.log('Upload base64');

	if (req.body === undefined) {
		res.sendStatus(400);
		return;
	}

	const key = req.body.key;
	if (key === undefined) {
		res.status(400).send('not contain key');
		return;
	}

	const game_type = req.body.game_type;
	if (game_type === undefined) {
		res.status(400).send('not contain game_type');
		return;
	}
	if (game_type != 1 && game_type != 2) {
		console.log(game_type);
		res.status(400).send('game_type invalid');
		return;
	}

	const media = req.body.media;
	if (media === undefined) {
		res.status(400).send('not contain media');
		return;
	} else {
		console.log('media : ' + media.substr(0, 500));
	}

	// Save base64 image to disk
	try {
		// Decoding base-64 image
		// Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
		function decodeBase64Image(md) {
			var matches = md.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
			console.log('matches', matches);
			var response = {};

			if (matches.length !== 3) {
				return new Error('Invalid input string');
			}

			response.type = matches[1];
			response.data = new Buffer(matches[2], 'base64');

			return response;
		}

		// Regular expression for image type:
		// This regular image extracts the "jpeg" from "image/jpeg"
		var imageTypeRegularExpression = /\/(.*?)$/;

		// Generate random string
		var crypto = require('crypto');
		var seed = crypto.randomBytes(20);
		var uniqueSHA1String = crypto.createHash('sha1').update(seed).digest('hex');

		var base64Data = 'data:image/png;base64,' + media;

		var imageBuffer = decodeBase64Image(base64Data);
		var userUploadedFeedMessagesLocation = '';

		var uniqueRandomImageName = 'image-' + uniqueSHA1String;
		// This variable is actually an array which has 5 values,
		// The [1] value is the real image extension
		var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);

		var userUploadedImagePath =
			userUploadedFeedMessagesLocation + uniqueRandomImageName + '.' + imageTypeDetected[1];

		// Save decoded binary image to disk
		try {
			require('fs').writeFile(userUploadedImagePath, imageBuffer.data, function(err) {
				if (err) throw err;
				console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
				res.status(200).json({
					error: false,
					data: key
				});
			});
		} catch (error) {
			console.log('ERROR:', error);
			res.status(200).json({
				error: true,
				data: key
			});
		}
	} catch (error) {
		console.log('ERROR:', error);
		res.status(200).json({
			error: true,
			data: key
		});
	}
});

app.post('/api/uploadphoto3/', (req, res) => {
	printTime();
	console.log('Upload base64');

	if (req.body === undefined) {
		res.sendStatus(400);
		return;
	}

	const key = req.query.key;
	if (key === undefined) {
		res.status(400).send('not contain key');
		return;
	}

	const game_type = req.query.game_type;
	if (game_type === undefined) {
		res.status(400).send('not contain game_type');
		return;
	}
	if (game_type != 1 && game_type != 2) {
		console.log(game_type);
		res.status(400).send('game_type invalid');
		return;
	}

	const media = req.body.media;
	if (media === undefined) {
		res.status(400).send('not contain media');
		return;
	} else {
		console.log('media : ' + media.substr(0, 500));
	}

	// Save base64 image to disk
	try {
		// Decoding base-64 image
		// Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
		function decodeBase64Image(md) {
			var matches = md.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
			var response = {};

			if (matches.length !== 3) {
				return new Error('Invalid input string');
			}

			response.type = matches[1];
			response.data = new Buffer(matches[2], 'base64');

			return response;
		}

		// Regular expression for image type:
		// This regular image extracts the "jpeg" from "image/jpeg"
		var imageTypeRegularExpression = /\/(.*?)$/;

		// Generate random string
		var crypto = require('crypto');
		var seed = crypto.randomBytes(20);
		var uniqueSHA1String = crypto.createHash('sha1').update(seed).digest('hex');

		var base64Data = 'data:image/png;base64,' + media;

		var imageBuffer = decodeBase64Image(base64Data);
		var userUploadedFeedMessagesLocation = '';

		var uniqueRandomImageName = 'image-' + uniqueSHA1String;
		// This variable is actually an array which has 5 values,
		// The [1] value is the real image extension
		var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);

		var userUploadedImagePath =
			userUploadedFeedMessagesLocation + uniqueRandomImageName + '.' + imageTypeDetected[1];

		// Save decoded binary image to disk
		try {
			require('fs').writeFile(userUploadedImagePath, imageBuffer.data, function(err) {
				if (err) throw err;
				console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
				res.status(200).json({
					error: false,
					data: key
				});
			});
		} catch (error) {
			console.log('ERROR:', error);
			res.status(200).json({
				error: true,
				data: key
			});
		}
	} catch (error) {
		console.log('ERROR:', error);
		res.status(200).json({
			error: true,
			data: key
		});
	}
});

app.post('/api/uploadphoto2', upload.any(), (req, res) => {
	printTime();
	console.log('Upload form');

	const key = req.query.key;
	if (key === undefined) {
		res.status(400).json({
			error: true,
			data: 'not contain body'
		});
		return;
	}

	const game_type = req.query.game_type;
	if (game_type === undefined) {
		res.status(400).json({
			error: true,
			data: 'not contain game_type'
		});
		return;
	}
	if (game_type != 1 && game_type != 2) {
		console.log(game_type);
		res.status(400).json({
			error: true,
			data: 'game_type invalid'
		});
		return;
	}

	if (req.files !== undefined) {
		console.log('Files : ' + req.files.length);
		req.files.forEach((value) => {
			console.log('File : ', value);
		});
		res.status(200).json({
			error: false,
			data: key
		});
	} else {
		console.log('file undefined');
		res.status(400).json({
			error: true,
			data: 'media file unrecognized'
		});
	}
});

app.listen(3000, () => {
	printTime();
	console.log('server is started in port 3000');
});

function printTime() {
	console.log('Time : ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds());
}
