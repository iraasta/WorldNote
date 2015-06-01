angular.module('starter.controllers',[])

  .controller('DashCtrl', function ($scope, $cordovaFacebook) {
    $cordovaFacebook.login(["public_profile", "email", "user_friends"])
      .then(function(success) {
        console.log("success" + success)
        // { id: "634565435",
        //   lastName: "bob"
        //   ...
        // }
      }, function (error) {
        // error
      });


    var options = {
      method: "feed",
      link: "http://example.com",
      caption: "Such caption, very feed."
    };
    $cordovaFacebook.showDialog(options)
      .then(function(success) {
        // success
      }, function (error) {
        // error
      });


    $cordovaFacebook.api("me", ["public_profile"])
      .then(function(success) {
        // success
      }, function (error) {
        // error
      });


    $cordovaFacebook.getLoginStatus()
      .then(function(success) {
        /*
         { authResponse: {
         userID: "12345678912345",
         accessToken: "kgkh3g42kh4g23kh4g2kh34g2kg4k2h4gkh3g4k2h4gk23h4gk2h34gk234gk2h34AndSoOn",
         session_Key: true,
         expiresIn: "5183738",
         sig: "..."
         },
         status: "connected"
         }
         */
      }, function (error) {
        // error
      });

    $cordovaFacebook.getAccessToken()
      .then(function(success) {
        // success
      }, function (error) {
        // error
      });

    $cordovaFacebook.logout()
      .then(function(success) {
        // success
      }, function (error) {
        // error
      });
  })

  .controller('ChatsCtrl', function ($scope, Chats, $http) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.gmap = {center: {latitude: 45, longitude: -73}, zoom: 8};
    $scope.myLocation = {
      lng: '',
      lat: ''
    }
    $scope.circle = {
      fill: {color: "#00AAFF", opacity: 0.3},
      stroke: {color: "#0044AA", weight: 1, opacity: .8},
      radius: 300
    }
    $scope.drawMap = function (position) {
      //$scope.$apply is needed to trigger the digest cycle when the geolocation arrives and to update all the watchers
      $scope.$apply(function () {

        console.log("Got geo")
        $scope.myLocation.lng = position.coords.longitude;
        $scope.myLocation.lat = position.coords.latitude;
        var coords = {
          latitude: $scope.myLocation.lat,
          longitude: $scope.myLocation.lng
        }
        $scope.map = {
          control : {},
          center: Object.create(coords),
          zoom: 14,
          pan: 1
        };

        $scope.marker = {
          id: 0,
          coords: coords,
          options : {
            draggable: false,
            title: "You"
          }
        };

      });
    };

    navigator.geolocation.getCurrentPosition($scope.drawMap);
    var t = function(cb){
      navigator.geolocation.getCurrentPosition(function(pos){cb(null,pos)})
    };
    var t2 = function(cb){
      //$http.get('http://iraasta.herokuapp.com').then(function(result){cb(null, result)})
      cb(null,[ {pos : {lat:1,lng:2}, name: ""} , {pos : {lat:2,lng:3}, name: ""}])
    };
    async.parallel({
        pos: t,
        chats : t2
    }, function(err, res){
        var id = 0
        $scope.chats = res.chats.map(function(a){
          return {pos: {latitude: a.pos.lat, longitude: a.pos.lng}, name: a.name, id: id++}
        });
        //setInterval(function(){
        //  $scope.chats.push({pos: {latitude: id, longitude: id}, name: id, id: id++})
        //},2000)
        $scope.drawMap(res.pos)
      }
    )
    $scope.remove = function (chat) {
      Chats.remove(chat);
    }
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  })
