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
              return CohortFactory.getAllResponders($stateParams.newsId)
              .then(function(responded){
                var namesOnly = responded.map(r => r.name)
                //return only uniq names
                var uniq = namesOnly.reduce(function(a,b){
                  if (a.indexOf(b) < 0 ) a.push(b);
                  return a;
                },[]);
                return uniq;
              });    
          }
        }
    });

});

app.controller('CohortCtrl', function($scope){


});

app.controller('SubmittedController', function($scope, classList, $stateParams){
    $scope.classList = classList;
    // var num = $stateParams.newsId;

    // socket.on('responded', function(num){
    //   CohortFactory.getAllResponders(num)
    //   .then(function(c){
    //     console.log('CCCCCC',c)
    //     $scope.classList = c;
    //   })
    // })
});




