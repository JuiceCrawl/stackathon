app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl',
        // resolve: {
        //   cohortList : function(CohortFactory){
        //     return CohortFactory.getAllUsers(1);
        //   }
        // }
    });
});