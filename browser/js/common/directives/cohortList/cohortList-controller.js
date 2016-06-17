app.controller('CohortController', function($scope, CohortFactory){
    
    CohortFactory.getAllUsers(1)
    .then(function(list){
      $scope.cohortList = list;
    });
    
});