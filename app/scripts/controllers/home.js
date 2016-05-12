'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('HomeCtrl', function ($scope,$timeout,dateFilter) {

	$scope.datapoints = [{"x":10,"top-1":107,"top-2":200},{"x":9,"top-1":51,"top-2":11},{"x":8,"top-1":80,"top-2":87},{"x":7,"top-1":81,"top-2":167},{"x":6,"top-1":139,"top-2":170},{"x":5,"top-1":156,"top-2":183},{"x":4,"top-1":68,"top-2":114},{"x":3,"top-1":177,"top-2":30},{"x":2,"top-1":73,"top-2":164},{"x":1,"top-1":145,"top-2":1},{"x":0,"top-1":168,"top-2":81}];
    $scope.datacolumns = [
    	{"id": "top-1", "type": "line", "name": "Top one"},
        {"id": "top-2", "type": "spline", "name": "Top two"}
        ];
    $scope.datax = {"id": "x"};

    $timeout(function () {
        $scope.datapoints = getRandomData();
    }, 3000);

    function getRandomData(){
   		var ar = [];
   		for (var i = 10; i >= 0; i--) {
   			ar.push(loadData(i));
   		}
   		return ar;
    }

    function loadData (i) {
        return {"x": i, "top-1": randomNumber(), "top-2": randomNumber()};
    }

    function randomNumber() {
        return Math.floor((Math.random() * 200) + 1);
    }

  });
