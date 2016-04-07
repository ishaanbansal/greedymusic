/*
 * author : Ishaan Bansal
 * email : ishaan.bansal.29@gmail.com
 * Angular app configuration
 */

 //Initialize App 
var app = angular.module('musicApp', ['ngRoute', 'ngResource']);
app.factory('Entry',function($resource){
    return $resource('/v1/tracks/:id',{id: '@_id'},{
        update:{
            method: 'POST'
        },
        delete:{
            method: 'DELETE'
        }
    });
});
var controllers = {};
var genres={}, selectedTrack;
controllers.homeController = function($scope, $http, $location, Entry) {
    $scope.tracks = {};
    
    //load all genres
    $http.get('/v1/genres/').success(function(data){
            for(var d in data){
                genres[data[d]._id]=data[d].name;
            }
        });

    $scope.getTracks = function(){
        var entries =  Entry.query(function(){
            $scope.tracks = entries;
        });
        //$http.get('/v1/tracks/').success(function(data){
          //  $scope.tracks = data;
        //});

    }
    $scope.getGenreName = function(id){
        return genres[id];
    }
    $scope.selectTrack = function(t){
        selectedTrack = t;
        $location.path('edittrack')

    }
    function initStarRating(){
        $('.rating-track').rating();
    }
    setInterval(initStarRating,200);
}

controllers.trackController = function($scope, $http, $location, Entry) {
    $scope.trackGenres = [];
    
    $scope.addTrack = function(){
        var track = {};
        track.title = $scope.title;
        $scope.rating = Number($('#input-star').val());
        if($scope.rating)
            track.rating = $scope.rating;
        if($scope.trackGenres.length)
            track.genres = $scope.trackGenres;
        
        var saveTrack = new Entry();
        saveTrack = track;
        Entry.save(saveTrack,function(){
            $location.path('/');
        });
        //$http.post('/v1/tracks/', track).success(function(data){
          //  $location.path('/');
        //});
    }
    $scope.editTrack = function(){
        var track = {};
        track.title = $scope.title;
        $scope.rating = Number($('#input-star').val());
        if($scope.rating)
            track.rating = $scope.rating;
        if($scope.trackGenres)
            track.genres = $scope.trackGenres;
        else
            track.genres = [];
        
        var edit = Entry.get({id: selectedTrack._id}, function(){
            edit.data = track;
            edit.$update(function(){
                $location.path('/');
            })
        });
        //$http.post('/v1/tracks/'+selectedTrack._id, track).success(function(data){
          //  $location.path('/');
        //});
    }
    $scope.deleteTrack = function(){
        var del = Entry.get({id: selectedTrack._id}, function(){
            del.$delete(function(){
                $location.path('/');
            })
        })
        //$http.delete('/v1/tracks/'+selectedTrack._id).success(function(data){
          //  $location.path('/');
        //});
    }
    $scope.loadSelectedTrack = function(){
        $scope.title = selectedTrack.title;
        $scope.rating = selectedTrack.rating;
        $scope.trackGenres = selectedTrack.genres;
        $('#input-star').rating('update', selectedTrack.rating).val();
    }

    //track-genre related
    $scope.boxVisible = false;
    $scope.toggleGenreBox = function(){
        $scope.boxVisible= !($scope.boxVisible);
        if($scope.boxVisible)
            $scope.getGenres();
    }
    $scope.addTrackGenre = function(id){
        if($scope.trackGenres.indexOf(id) < 0){
            $scope.trackGenres.push(id);
        }
    }
    $scope.removeGenre = function(gen){
        var index = $scope.trackGenres.indexOf(gen);
        if (index > -1) {
            if ($scope.trackGenres.length == 1)
                $scope.trackGenres = [];
            else
                $scope.trackGenres.splice(index, 1);
        }
    }
    //Genre related
    $scope.genreList = {};
    $scope.getGenres = function(){
        $http.get('/v1/genres/').success(function(data){
            $scope.genreList = data;
        });
    }
    $scope.addGenre = function(){
        $http.post('/v1/genres/',{'name':$scope.genreSearch}).success(function(data){
            $scope.getGenres();
            genres[data._id]=data.name;
        });
    }
    $scope.getGenreName = function(id){
        return genres[id];
    }
    var genreInConsideration='';
    $scope.editGenre = function(gen){
        genreInConsideration = gen;
        $scope.name = gen.name;
    }
    $scope.editGenreName = function(){
        genreInConsideration.name = $scope.name;
        $http.post('/v1/genres/'+genreInConsideration._id, genreInConsideration).success(function(data){
            genres[data._id]=data.name;
        });
    }
    $('#input-star').rating();
}

app.controller(controllers);

app.filter('searchFor', function(){
    return function(list, searchString, attribute){
        
        if(!searchString){
            return list;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(list, function(item){
            if(item[attribute].toLowerCase().indexOf(searchString) !== -1){
            result.push(item);
        }
        });
        return result;
    };
});
   
app.config(function($routeProvider){
  $routeProvider
    // home
    .when('/', {
      templateUrl: '/home',
      controller: 'homeController'
    })
    .when('/addtrack', {
      templateUrl: '/addtrack',
      controller: 'trackController'
    })
    .when('/edittrack', {
      templateUrl: '/edittrack',
      controller: 'trackController'
    });

});