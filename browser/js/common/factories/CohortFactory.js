app.factory('CohortFactory', function ($http) {
  return {
    getAllUsers: function(cohortId){
      return $http.get('/api/cohort/' + cohortId + '/classmates')
      .then(function(classmates){
        return classmates.data;
      })
      .then(null, function(err){
        console.error(err);
      });
    },
    getCohort: function(cohortId){
      return $http.get('/api/cohort/' + cohortId)
      .then(function(cohort){
        return cohort.data;
      })
      .then(null, function(err){
        console.error(err);
      });
    },
    getAllResponders: function(newsId){
      return $http.get(`/api/newsletters/${newsId}/authors`)
      .then(function(classmates){
        return classmates.data;
      })
      .then(null, function(err){
        console.error(err);
      });
    }
  };
});