/*
 * author : Ishaan Bansal
 * email : ishaan.bansal.29@gmail.com
 */
var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Genre = mongoose.model('Genre');

module.exports = function(){
	console.log('genre API spawned');
	router.route('/')
		//creates a new question
		.post(function(req, res){
			var genre = new Genre();
			for( i in req.body ){
				genre[i] = req.body[i]
			}
			genre.save(function(err, genre) {
				if (err){
					return res.status(500).send(err);
				}else{
					return res.json(genre);
				}
			});
		})
		//gets all genres
		.get(function(req, res){
			Genre.find(function(err, genres){
				if(err){
					return res.status(500).send(err);
				}else{
					return res.status(200).send(genres);
				}
			});
		});

	//genre-specific commands.
	router.route('/:id')
		//gets specified genre
		.get(function(req, res){
			Genre.findById(req.params.id, function(err, genre){
				if(err)
					res.send(err);
				else
					res.json(genre);
			});
		}) 
		//updates specified genre
		.post(function(req, res){
			Genre.findById(req.params.id, function(err, genre){
				if(err)
					res.send(err);

				for( i in req.body ){
					genre[i] = req.body[i]
				}

				genre.save(function(err, genre){
					if(err)
						res.send(err);
					else
						res.json(genre);
				});
			});
		})
		//deletes the genre
		.delete(function(req, res) {
			Genre.remove({
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