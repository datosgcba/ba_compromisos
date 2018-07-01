"use strict";

angular.module("compromisosSiteApp").directive("clickeableIlustration", function() {
	return {
		restrict: "E",
		scope: {
			ilustrationName: "=",
			showCompromiso: "&",
		},
		template:
			"<div class='ilustration'></div>",
		replace: true,
		link: function($scope, elm, attrs) {


			d3.xml("images/ilustraciones/" + $scope.ilustrationName + ".svg", function(
                error,
                documentFragment
              ) {
                if (error) {
                  console.error(error);
                  return;
                }
                $('.ilustration').append(documentFragment.cloneNode(true).documentElement);
                $('.ilustration svg g#items image').on('click',function(e){
                	var p = $(this).parent();
                	var idAttr = $(p).attr('id').replace('c','');
                	var cId = parseInt(idAttr);
            		$scope.$apply(function(){
                		$scope.showCompromiso({cId: cId});
                	})
                })
              });
		}
	};
});
