app.config(function ($stateProvider, $urlRouterProvider) {
$urlRouterProvider.when('/cohort/:id', '/cohort/:id/updateme');
    $stateProvider.state('cohort', {
        url: '/cohort/:id',
        controller: 'CohortCtrl',
        templateUrl: 'js/cohorts/cohorts.html',
        resolve: {
          classList: function($stateParams, CohortFactory){ 
              return CohortFactory.getAllUsers($stateParams.id);    
          }
        }
    })
    .state('cohort.updateme', {
        url: '/updateme',
        controller: 'TextBoxController',
        templateUrl: 'js/text-box/text-box.html',
        resolve : {
          cohort: function($stateParams, CohortFactory){
              return CohortFactory.getCohort($stateParams.id);
          }
        }
    })
    .state('cohort.submitted', {
        url: '/submitted',
        templateUrl: 'js/cohorts/submitted.html',
    })

});

app.controller('CohortCtrl', function($scope, classList){
    // $scope.cohort = cohort;
    $scope.classList = classList;
});