// Page home
var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider){
    $routeProvider
    .when("/",{
        templateUrl : "../Page/home.html",
        controller: "CTRL"
        })
    .when("/POKEDEX", {
        templateUrl : "../Page/pokedex.html",
        controller: "CTRL2"
        })
    .when("/STORE", {
        templateUrl : "../Page/store.html",
        controller: "CTRL3"
        })
});
app.controller('CTRL1',['$scope','$location',function($scope,$location){
    $scope.isActive = function(destination){
        return destination === $location.path();
    }
}]);
window.onscroll = function() {myFunction()};
var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;
function myFunction() {
  if (window.pageYOffset > sticky) {
    navbar.classList.add("sticky")
  } else if(window.pageYOffset <= sticky) {
    navbar.classList.remove("sticky");
  }
}
//Page home
app.controller('CTRL', function($scope, $http) {
  $http.get("../database/banner.json")
  .then(function (response) {
    $scope.banner = response.data; 
  })
});
// Page pokedex
app.controller('CTRL2', function($scope, $http){
  $http.get("../database/pokedex.json")
  .then(function (response) {
    $scope.pokemon = response.data.pokemon;
    $scope.x = 0;
    $scope.y = [];
    for(let i = 0; i < $scope.pokemon.length/6; i++){
      $scope.y.push($scope.x);
      $scope.x+=6;
    }
  });
  
});
//Page Store
app.controller('CTRL3', function($scope, $http ){
  $http.get("../database/pokestore.json")
  .then(function (response) {
    $scope.store = response.data;
  });
  
  $scope.x = 0;
  $scope.y = [];
  for(let i = 0; i < 9; i++){
  $scope.y.push($scope.x);
  $scope.x+=3;
}
$scope.img = "";
$scope.$on("fileProgress", function(e, progress) {
  $scope.progress = progress.loaded / progress.total;
});
$scope.add = function(){
  $scope.store.push($scope.stores);
$scope.cancle = function(){
  $scope.stores = {};}
console.log($scope.store)
}
});
app.directive("ngFileSelect", function(fileReader, $timeout) {
  return {
    scope: {
      ngModel: '='
    },
    link: function($scope, el) {
      function getFile(file) {
        fileReader.readAsDataUrl(file, $scope)
          .then(function(result) {
            $timeout(function() {
              $scope.ngModel = result;
            });
          });
      }

      el.bind("change", function(e) {
        var file = (e.srcElement || e.target).files[0];
        getFile(file);
      });
    }
  };
});
app.factory("fileReader", function($q, $log) {
var onLoad = function(reader, deferred, scope) {
  return function() {
    scope.$apply(function() {
      deferred.resolve(reader.result);
    });
  };
};
var onError = function(reader, deferred, scope) {
  return function() {
    scope.$apply(function() {
      deferred.reject(reader.result);
    });
  };
};
var onProgress = function(reader, scope) {
  return function(event) {
    scope.$broadcast("fileProgress", {
      total: event.total,
      loaded: event.loaded
    });
  };
};
var getReader = function(deferred, scope) {
  var reader = new FileReader();
  reader.onload = onLoad(reader, deferred, scope);
  reader.onerror = onError(reader, deferred, scope);
  reader.onprogress = onProgress(reader, scope);
  return reader;
};
var readAsDataURL = function(file, scope) {
  var deferred = $q.defer();

  var reader = getReader(deferred, scope);
  reader.readAsDataURL(file);

  return deferred.promise;
};
return {
  readAsDataUrl: readAsDataURL
};

});
