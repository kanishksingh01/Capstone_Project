from django.db import models
from django.contrib.auth.models import User

class SavingsData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_income = models.FloatField()
    subtracted_values = models.JSONField()  # Store subtracted values as JSON
    remaining_income = models.FloatField()
    created_at = models.DateField(auto_now_add=True)

class GoalPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_income = models.FloatField()  
    subtracted_values = models.JSONField()  # Stores costs as JSON 
    remaining_income = models.FloatField()  
    savings_goal = models.FloatField()  
    monthly_percentage = models.FloatField()  
    goal_percentage = models.FloatField(default=0.0)  # New field with default value
    created_at = models.DateField(auto_now_add=True)  # Timestamp 

   