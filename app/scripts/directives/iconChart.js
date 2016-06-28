'use strict';

angular.module('compromisosSiteApp')
.directive('iconChart', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
          icono: '=icono',
          cantidad: '=cantidad',
          orientacion: '=orientacion'
        },
        controller: function($scope, $http, LoadSVGService) {

            $scope.qty = d3.range(0,parseInt($scope.cantidad));
            $scope.range10 = d3.range(0,10);

            var cols = Math.floor(parseInt($scope.cantidad)/10);
            var resto = parseInt($scope.cantidad)%10;
            $scope.cols = $scope.range10.map(function(i){
              console.log(i,cols);
              var items = [];
              if(i<cols){
                items = d3.range(0,10);
              }
              if(i==cols){
                items = d3.range(0,resto);
              }
              return {items:items};
            });

            LoadSVGService.loadIcon($scope.icono,function(iconLoaded){
              $('.icon-chart-svg-container-icon').html(iconLoaded.cloneNode(true));
            });


        }, 
        templateUrl: 'views/directives/iconChart.html'
    };

});