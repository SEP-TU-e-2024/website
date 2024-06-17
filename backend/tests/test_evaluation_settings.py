from api.models import EvaluationSettings
from django.test import TestCase


class EvalTest(TestCase):
    def setUp(self):
        EvaluationSettings.objects.create(id='beb82773-ed92-4e57-82bf-91ea72503777', cpu=3, time_limit=30.0)
        EvaluationSettings.objects.create(id='8442a494-6118-4f18-80a8-90e937f20129', cpu=12, time_limit=90.3)

    def test_storage(self):
        self.assertEqual(
            EvaluationSettings.objects.filter(id="8442a494-6118-4f18-80a8-90e937f20129").get().cpu,
            12
        )
        self.assertEqual(
            EvaluationSettings.objects.filter(id="8442a494-6118-4f18-80a8-90e937f20129").get().time_limit,
            90.3
        )
        self.assertEqual(
            EvaluationSettings.objects.filter(id="beb82773-ed92-4e57-82bf-91ea72503777").get().cpu,
            3
        )
        self.assertEqual(
            EvaluationSettings.objects.filter(id="beb82773-ed92-4e57-82bf-91ea72503777").get().time_limit,
            30.0
        )
        
        
        
    
        

