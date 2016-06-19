app.config(function ($stateProvider, $urlRouterProvider) {
$urlRouterProvider.when('/:newsId/cohort/:id', '/:newsId/cohort/:id/updateme');
    $stateProvider.state('cohort', {
        url: '/:newsId/cohort/:id',
        controller: 'CohortCtrl',
        templateUrl: 'js/cohorts/cohorts.html', 
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
        controller: 'SubmittedController',
        resolve: {
          classList: function($stateParams, CohortFactory){ 
              return CohortFactory.getAllResponders($stateParams.newsId);    
          }
        }
    })

});

app.controller('CohortCtrl', function($scope){


});

app.controller('SubmittedController', function($scope, classList){
    $scope.classList = classList;
    console.log($scope.classList);
});




