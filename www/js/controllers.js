angular.module('starter.controllers',['starter.services', 'ngOpenFB'])

  .controller('DashCtrl', function ($scope, ngFB) {
    $scope.fbLogin = function() {
      ngFB.login({scope: 'email,name,id,read_stream,publish_actions'}).then(
        function (response) {
          if (response.status === 'connected') {
            var token = response.authResponse.accessToken;
            window.localStorage.setItem("token", token);
            window.disconnected = (status.status != "connected")
          } else {
            alert('Facebook login failed');
          }
        });
    }
    ngFB.api({
      path: '/me',
      params: {fields: 'id,name'}
    }).then(
      function (user) {
        console.log("Got info")
        console.log(user)
        $scope.user = user;
      },
      function (error) {
        alert('Facebook error: ' + error.error_description);
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
  .controller('ProfileCtrl', function ($scope, ngFB) {
    ngFB.api({
      path: '/me',
      params: {fields: 'id,name'}
    }).then(
      function (user) {
        $scope.user = user;
      },
      function (error) {
        alert('Facebook error: ' + error.error_description);
      });
  });
