app.factory('CohortFactory', function ($http) {
  return {
    getAllUsers: function(cohortId){
      return $http.get('/api/cohort/' + cohortId)
      .then(function(classmates){
        return classmates.data;
      })
      .then(null, function(err){
        console.error(err);
      });
    }
  };
});