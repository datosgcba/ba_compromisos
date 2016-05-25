'use strict';

angular.module('compromisosSiteApp')
.directive('imageFull', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      image: '=image'
    },
    templateUrl: 'views/directives/imageFull.html'
  };
});