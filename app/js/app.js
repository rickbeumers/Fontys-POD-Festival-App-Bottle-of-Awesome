var app = angular.module('starter', [
    'ionic',
    'ngCordova',
    'cb.x2js',
    'ngLodash',
    'pouchdb',
    'ImgCache',
    'angular.filter',
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls"
]);

app.run(function($ionicPlatform, $rootScope, $log, $q, ImgCache, ArtistService, $cordovaStatusbar, AreaService) {
    ImgCache.options.debug = true;
    ImgCache.options.chromeQuota = 50*1024*1024; 

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            // StatusBar.styleDefault();
            $cordovaStatusbar.styleHex('#eb6772');
        }

        // Loading Google Analytics
        if (typeof analytics !== 'undefined') {
            $log.debug('starting analytics');
            analytics.startTrackerWithId("UA-16476871-20");
        } else {
            $log.warn('Analytics API not available...');
        }

        // Initialize Image Caching
        var imgDefer = $q.defer();

        ImgCache.options.skipURIencoding=true;
        ImgCache.init(function() {
            $log.info('ImgCache init: success!');
            imgDefer.resolve()
        }, function(){
            $log.info('ImgCache init: error! Check the log for errors');
            imgDefer.reject()
        });

        var imgPromise = imgDefer.promise;
        var favouritesPromise;
        var areaPromise;

        // This will set artist variable global
        ArtistService.getArtists().then(function(data) {
            $rootScope.artists = data;

            var favouritesDefer = $q.defer();
            // This will set favourites variable global
            ArtistService.getFavourites().then(function(data) {
                $rootScope.favourites = data;

                // This will set an favourited value of true if the artist is favorited
                angular.forEach(data.artists, function(obj) {
                    angular.forEach($rootScope.artists.artist, function(res) {
                        if(obj == res._id) {
                            res.favourited = true;
                        }
                    });
                    $log.log(obj)
                });
                favouritesDefer.resolve();
            }).catch(function(err){
                favouritesDefer.reject("Error with favourties", err);
            });

            favouritesPromise = favouritesDefer.promise;

            var areaDefer = $q.defer();

            AreaService.getAreas().then(function(data) {
                // This will add a stageName to every artist.
                angular.forEach(data.area, function(area) {
                    angular.forEach($rootScope.artists.artist, function(res) {
                        if(res.stage_id === area._id) {
                            res.stage_name = area.title.__cdata;
                        }
                    });
                });
                areaDefer.resolve();
            });

            areaPromise = areaDefer.promise;
        });
        
        $q.all([imgPromise, favouritesPromise, areaPromise]).then(function() {
            if (!!navigator.splashscreen) {
                navigator.splashscreen.hide();
            }
        });    
    });  
});

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, ImgCacheProvider) {

    // Options for ImgCache
    ImgCacheProvider.setOption('debug', true);
    ImgCacheProvider.setOption('usePersistentCache', true);
    
    // Set Init manually so we can wait for device to be ready
    ImgCacheProvider.manualInit = true;

    // Enable native scrolling for Android
    if(!ionic.Platform.isIOS()) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
    }

    // Routing Options
    $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.news', {
        url: '/news',
        views: {
            "menuContent": {
                templateUrl: 'templates/news.html',
                controller: 'NewsCtrl'
            }
        }
    })
    .state('app.artists', {
        url: '/artists',
        views: {
            "menuContent": {
                templateUrl:  'templates/artists.html',
                controller: 'ArtistsCtrl'
            }
        }
    })
    .state('app.artist', {
        url: '/artists/:id',
        views: {
            "menuContent": {
                controller: 'ArtistCtrl',
                templateUrl: 'templates/artist.html'
            }
        }
    })
    .state('app.info', {
        url: '/info',
        views: {
            "menuContent": {
                templateUrl:  'templates/info.html',
                controller: 'InfoCtrl'
            }
        }
    })
    .state('app.aboutus', {
        url: '/info/aboutus',
        views: {
            "menuContent": {
                templateUrl:  'templates/info-pages/aboutus.html',
                controller: 'InfoPageCtrl'
            }
        }
    })    
    .state('app.disclaimer', {
        url: '/info/disclaimer',
        views: {
            "menuContent": {
                templateUrl:  'templates/info-pages/disclaimer.html',
                controller: 'InfoPageCtrl'
            }
        }
    })    
    .state('app.general', {
        url: '/info/general',
        views: {
            "menuContent": {
                templateUrl:  'templates/info-pages/general.html',
                controller: 'InfoPageCtrl'
            }
        }
    })    
    .state('app.hotelpackages', {
        url: '/info/hotelpackages',
        views: {
            "menuContent": {
                templateUrl:  'templates/info-pages/hotelpackages.html',
                controller: 'InfoPageCtrl'
            }
        }
    })    
    .state('app.howtogetthere', {
        url: '/info/howtogetthere',
        views: {
            "menuContent": {
                templateUrl:  'templates/info-pages/howtogetthere.html',
                controller: 'InfoPageCtrl'
            }
        }
    })    
    .state('app.qa', {
        url: '/info/qa',
        views: {
            "menuContent": {
                templateUrl:  'templates/info-pages/qa.html',
                controller: 'InfoPageCtrl'
            }
        }
    })    
    .state('app.schedule', {
        url: '/schedule',
        views: {
            "menuContent": {
                templateUrl:  'templates/schedule.html',
                controller: 'ScheduleCtrl'
            }
        }
    })
    .state('app.map', {
        url: '/map',
        views: {
            "menuContent": {
                templateUrl:  'templates/map.html',
                controller: 'MapCtrl'
            }
        }
    })
    .state('app.favorites', {
        url: '/favorites',
        views: {
            "menuContent": {
                templateUrl:  'templates/favorites.html',
                controller: 'FavoritesCtrl'
            }
        }
    })
    .state('app.xomemories', {
        url: '/xomemories',
        views: {
            "menuContent": {
                templateUrl:  'templates/xomemories.html',
                controller: 'XOmemoriesCtrl'
            }
        }
    })
    .state('app.xomemoriesNext', {
        url: '/xomemoriesNext',
        views: {
            "menuContent": {
                templateUrl:  'templates/xomemoriesNext.html',
                controller: 'xomemoriesNextCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise('/app/news');
});

