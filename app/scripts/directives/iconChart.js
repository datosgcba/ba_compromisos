'use strict';

angular.module('compromisosSiteApp')
.directive('iconChart', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
          icono: '=icono',
          orientacion: '=orientacion',
          base: '=base',
          opciones: '=opciones'
        },
        controller: function($scope, $http, LoadSVGService) {

            $scope.qty = d3.range(0,parseInt($scope.base.cantidad));
            $scope.range10 = d3.range(0,10);

            var cols = Math.floor(parseInt($scope.base.cantidad)/10);
            var resto = parseInt($scope.base.cantidad)%10;
            var idAcum = 0;
            $scope.cols = $scope.range10.map(function(i){
              var items = [];
              if(i<cols){
                items = d3.range(idAcum,idAcum+10);
                idAcum+=10;
              }
              if(i==cols){
                items = d3.range(idAcum,idAcum+resto);
              }
              return {items:items};
            });

            LoadSVGService.loadIcon($scope.icono,function(iconLoaded){
              $('.icon-chart-svg-container-icon').html(iconLoaded.cloneNode(true));
              addOpciones();
            });

            function addOpciones(){
              $('.icon-chart-svg-container-icon .st0').css('fill',$scope.base.color);
              var pointer=0;
              angular.forEach($scope.opciones,function(e){
                angular.forEach(d3.range(pointer,pointer+e.cantidad),function(){
                  $('#icon-chart-svg-'+pointer+' .st0').css('fill',e.color);
                  pointer++;
                });
              });
            }


        }, 
        templateUrl: 'views/directives/iconChart.html'
    };

});