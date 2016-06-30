'use strict';

angular.module('compromisosSiteApp')
.directive('iconChart', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
          icono: '=icono',
          items: '=items',
          orientacion: '=orientacion',
          base: '=base',
          opciones: '=opciones'
        },
        controller: function($scope, $http, LoadSVGService) {

            $scope.items = ($scope.items)?parseInt($scope.items):10;

            $scope.qty = d3.range(0,parseInt($scope.base.cantidad));
            $scope.range10 = d3.range(0,$scope.items);

            var cols = Math.floor(parseInt($scope.base.cantidad)/$scope.items);
            var resto = parseInt($scope.base.cantidad)%$scope.items;
            var idAcum = 0;
            $scope.cols = $scope.range10.map(function(i){
              var items = [];
              if(i<cols){
                items = d3.range(idAcum,idAcum+$scope.items);
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
              
              $('.icons-chart-base')
                .css('color',$scope.base.color)
                .css('border-color',$scope.base.color);

              $('.icons-chart-option').each(function(e){
                var color = $(this).data('color');
                $(this).css('color',color);
                //$(this).find('.icon-chart-svg-container-icon .st0').css('fill',color);
              });

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