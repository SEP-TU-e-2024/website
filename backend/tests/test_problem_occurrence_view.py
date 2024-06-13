# import json

# from api.models import EvaluationSettings, Metric, ProblemCategory, SpecifiedProblem
# from rest_framework.test import APITestCase


# class ProblemOccurenceViewTest(APITestCase):
#     def setUp(self):
#         #Set up a test category
#         self.cat = ProblemCategory.objects.create(
#             name='TestCategory',
#             style=1,
#             type=1,
#             description='TestDescription'
#         )
#         #Set up a test evaluation settings
#         self.eval = EvaluationSettings.objects.create(cpu=1,time_limit=1)
#         #Set up metric
#         self.metric = Metric.objects.create()
#         #Set up a test specified problem
#         self.problem = SpecifiedProblem.objects.create(
#             name='TestProblem',
#             evaluation_settings=self.eval,
#             category=self.cat,
#             scoring_metric=self.metric
#         )


#     def test_problem_list(self):
#         #Send a request to the api endpoint
#         resp = self.client.get('/api/problems/problem_occurrence/' + str(self.problem.id))

#         # unpack the json object
#         cat = json.loads(resp.content.decode())

#         problem = cat['']
#         #test specified problem attributes
#         self.assertEqual(problem['id'], str(self.problem.id))
#         self.assertEqual(problem['name'], self.problem.name)
#         self.assertEqual(problem['metrics'], self.problem.metrics)
#         self.assertEqual(problem['category'], str(self.cat.id))

#         #get the evaluation settings
#         evaluation = problem['evaluation_settings']
#         self.assertEqual(evaluation['cpu'], 1)
#         self.assertEqual(evaluation['time_limit'], 1.0)

