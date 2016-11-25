/*
Loading Accessory directive
Attribute: loading-accessory
Used in <ion-item> to add an accessory icon on the right that turns into
a loading spinner when clicked.

If given an argument then it will use that glyphoicon as the icon.
Defaults to ion-chevron-right.
ie: <ion-item loading-accessory="ion-earth">

*/

import angular from 'angular';
import 'ionic-scripts';

export const name = 'loadingAccessory';

export default angular.module(name, [
  'ionic'
])
.directive('loadingAccessory', ($compile, $rootScope) => {
  var template = `<i class="icon icon-accessory icon-loading-accessory" ng-class="{'{{_LAClass}}': !_LALoading}"><ion-spinner ng-if="!!_LALoading"></ion-spinner></i>`;
  return {
    restrict: 'A',  //Restrict to attribute only
    scope: false,   //Use the parent scope the directive is called in, only sets two variables
    priority: 0,    //Execute at normal priority
    //Post-link function to compile the template and append it to the content, requires $scope
    link: ($scope, $element, $attrs) => {
      //Bind a click function to the element that starts the loading sequence
      $element.bind('click', () => {
        //$scope.$apply needed to update the template outside of reactive environment
        $scope.$apply(() => {
          //Set loading variable to true
          $scope._LALoading = true;

          //On successful route state change, delete both variables used by this directive
          $rootScope.$on('$stateChangeSuccess', () => {
            delete $scope._LALoading;
            delete $scope._LAClass;
          });
        });
      });
      //Set both variables used by this directive, using low-conflict namespace
      $scope._LAClass = $attrs.loadingAccessory || 'ion-chevron-right';
      $scope._LALoading = false;
      /*
      If the ion-item is complex, such as having option buttons or slide
        add accessory to the .item-content sub-div
      Otherwise just use the base element as that sub div isn't there
      */
      var content = ($element.hasClass('item-complex')) ? $element.find('.item-content') : $element;
      content.append($compile(template)($scope));
    }
  }
});
