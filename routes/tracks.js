/*
 * author : Ishaan Bansal
 * email : ishaan.bansal.29@gmail.com
 */
var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Track = mongoose.model('Track');

module.exports = function(){
	console.log('tracks API spawned');
	router.route('/')
		//creates a new question
		.post(function(req, res){
			var track = new Track();
			for( i in req.body ){
				track[i] = req.body[i]
			}
			track.save(function(err, track) {
				if (err){
					return res.status(500).send(err);
				}else{
					return res.json(track);
				}
			});
		})
		//get all tracks
		.get(function(req, res){
			//if(req.query.title === undefined){
				Track.find(function(err, tracks){
					if(err){
						return res.status(500).send(err);
					}else{
						return res.status(200).send(tracks);
					}
				});
			/*} else{
				Track.find({ "title": { $regex: req.query.title, $options: 'i' } },function(err, tracks){
					if(err){
						return res.status(500).send(err);
					}else{
						return res.status(200).send(tracks);
					}
				});
			}*/
		});

	//track-specific commands.
	router.route('/:id')
		//gets specified track
		.get(function(req, res){
			Track.findById(req.params.id, function(err, track){
				if(err)
					res.send(err);
				else
					res.json(track);
			});
		}) 
		//updates specified track
		.post(function(req, res){
			Track.findById(req.params.id, function(err, track){
				if(err)
					res.send(err);

				for( i in req.body ){
					track[i] = req.body[i]
				}

				track.save(function(err, track){
					if(err)
						res.send(err);
					else
						res.json(track);
				});
			});
		})
		//deletes the track
		.delete(function(req, res) {
			Track.remove({
				_id: req.params.id
			}, function(err) {
				if (err)
					res.send(err);
				else
					res.json("deleted");
			});
		});
	return router;
}