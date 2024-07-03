import json
import random

from api.models import (
    Result,
    Submission,
)
from api.views.leaderboard_view import LeaderboardView

from .create_test_data import CreateTestData


class LeaderboardViewTest(CreateTestData):
    def setUp(self):
        super(LeaderboardViewTest, self).setUp()

        #Add 100 random submissions
        self.submissions = []
        self.results = []
        for i in range(100):
            #Create the submission
            self.submissions += [Submission.objects.create(
                user=self.test_user,
                problem=self.problem,
                name=f'test submission {i}',
            )]
            
            #Create a result for that submission
            self.results += [Result.objects.create(
                metric=self.sc_metric,
                #Randomly generate value
                score=random.randint(0,100),
                benchmark_instance=self.benchmark,
                submission=self.submissions[i]
            )]

    def test_leaderboard_sorting(self):
        #Send a request to the api endpoint
        request = self.rf.get('/api/leaderboard/' + str(self.problem.id))
        view = LeaderboardView.as_view()
        response = view(request, problem_id=self.problem.id)

        # unpack the json object
        result = json.loads(response.content.decode())
        self.assertEqual(response.status_code, 200)

        #check whether leaderboard is sorted
        prev = -1
        for score in result['entries']:
            #Get the current entry score
            current = float(score['results']['test metric'])
            self.assertGreaterEqual(current, prev, 'LeaderboardEntry not sorted!') #Compare previous entry to next entry (in order of the list), throw error if not ascending
            prev = current #Update pointer to previous entry
        
    def test_leaderboard_problem_non_existent(self):
        #Send a request to the api endpoint
        request = self.rf.get('/api/leaderboard/f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111')

        # Call the view function directly
        view = LeaderboardView.as_view()
        response = view(request, problem_id='f9e9cb40-9f4c-4fa3-8fa5-2004f4e02111')  # Pass the same ID here

        # Assert the response status code
        self.assertEqual(response.status_code, 404)

        
        