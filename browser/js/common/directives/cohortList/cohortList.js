app.directive('cohortList', function () {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/cohortList/cohortList.html',
        controller: 'CohortController'
    };

});

app.controller('CohortController', function($scope, CohortFactory){
    
    CohortFactory.getAllUsers(1)
    .then(function(list){
      $scope.cohortList = list;
    });
    
});