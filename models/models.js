/*
 * author : Ishaan Bansal
 * email : ishaan.bansal.29@gmail.com
 * Schemas for the data
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var trackSchema = new mongoose.Schema({
	created_at: {type: Date, default: Date.now},
	title: String,
	genres: Array,
	rating: Number
});
var genreSchema = new mongoose.Schema({
	created_at: {type: Date, default: Date.now},
	name: String
});

mongoose.model('Track', trackSchema);
mongoose.model('Genre', genreSchema);