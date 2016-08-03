'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso04Ctrl', function ($sce,$templateRequest, $compile,   UrlService, $scope, $http,SlugColorService,LoadSVGService) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    //para ir a otra url en el padre
    //pymChild.navigateParentTo('https://github.com/nprapps/pym.js');

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 4; });
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.secondColor = '#bdbec2';
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.numero,function(iconLoaded){
        /*$(iconLoaded)
            .attr('width', 50)
            .attr('height', 50)
            .get(0);*/
        $('.icon-svg-container').html(iconLoaded.cloneNode(true));
      });
      //console.log($scope.currentCompromise);;
    });

     $scope.dataLoaded2 = function(id,data){
      $scope.medicos = data;
      $scope.mediConfig = [];

      angular.forEach(data,function(d){
        $scope.mediConfig.push({
          icono:'hombre',
          orientacion: 'rows',
          items: 10,
          base:{
            titulo: '',
            color: $scope.currentCompromise.color,
            cantidad: parseInt(d.agentes)/200
          },
          opciones:[
            {
              titulo: '',
              color: $scope.currentCompromise.color,
              cantidad: parseInt(d.periodos)
            }
          ]

        })
      });

      var templateUrl = $sce.getTrustedResourceUrl('views/includes/agentes.html');
      $templateRequest(templateUrl).then(function(template) {
          $compile($('#'+id).html(template).contents())($scope);
      });
    };




    var id;
    $(window).resize(function() {
        clearTimeout(id);
        id = setTimeout(function(){
          // if(chart1){
          //   createCustomChart1();
          // }
        }, 500);
    });


  });
