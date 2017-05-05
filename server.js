var path = require('path');
var fs = require('fs');
var express = require('express');
var mongodb = require('mongodb');

var app = express();
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'components')));
app.use('/', express.static(path.join(__dirname, 'data')));

var server = app.listen(3000);
console.log('Server is running in port 3000');

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/demo';

var io = require('socket.io')(server);

var sendChats = function (socket) {

	fs.readFile('data/data.json', 'utf8', function(err, chats) {
		chats = JSON.parse(chats);
		socket.emit('chats', chats);
	});

	// MongoClient.connect(url, function (err, db) {
	// 	if (err) {
	// 		console.log(err);
	// 	} else {
	// 		var collection = db.collection('chatlog2');
	// 		collection.find().toArray(function(err, items) {
	// 			socket.emit('chats', items);
	// 	 });
	// 	}
	// });

};

io.on('connection', function (socket) {
  console.log('New connection!');

  socket.on('fetchChats', function () {
		sendChats(socket);
	});

	socket.on('newChat', function (chat, callback) {

		fs.readFile('data/data.json', 'utf8', function(err, chats) {
			chats = JSON.parse(chats);
			chats.push(chat);
			fs.writeFile('data/data.json', JSON.stringify(chats, null, 4), function (err) {
				io.emit('chats', chats);
				callback(err);
			});
		});

		// MongoClient.connect(url, function (err, db) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     var collection = db.collection('chatlog2');
    //       collection.insert([{'author': chat.author, 'text': chat.text}], function (err, result){
    //     if (err) {
    //       console.log(err);
    //     } else {
		// 			sendChats(socket);
		// 			callback(err);
		// 		}
    //     db.close();
    //   });
    //   }
    // });

	});
});
