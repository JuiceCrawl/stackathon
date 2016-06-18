app.config(function ($stateProvider) {

    $stateProvider.state('admin', {
        url: '/admin',
        controller: 'AdminController',
        templateUrl: 'js/admin/admin.html',
        resolve: {
          newsletters : function(AdminFactory){
            return AdminFactory.getAllNewsletters();
          },
          cohorts: function(AdminFactory){
            return AdminFactory.getAllCohorts();
          },
        }
    });

});

app.controller('AdminController', function ($scope, AdminFactory, newsletters, cohorts) {

  $scope.sendEmails = function(cohort){
    AdminFactory.sendEmails({cohort: cohort.name})
    .then(function(){
      $scope.cohortName = '';
    });
  };

  $scope.sendCompilation = function(newsletter){
    AdminFactory.sendCompilation(newsletter.id)
    .then(function(){
      $scope.newsId = '';
    });
  };

  $scope.updateCohorts = function(selectedCohort){
    AdminFactory.updateCohorts(selectedCohort)
    .then(function(){
      $scope.selectedCohort = {};
    });
    
  };

  $scope.newsletters = newsletters;
  $scope.cohorts = cohorts;  

});