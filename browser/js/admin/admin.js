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

  $scope.sendEmails = function(name){
    //name is the full cohort object
    AdminFactory.sendEmails({cohort: name.name})
    .then(function(){
      $scope.name = '';
    })
  };

  $scope.newsletters = newsletters;
  $scope.cohorts = cohorts;  

});