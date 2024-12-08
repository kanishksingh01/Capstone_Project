from django import forms
from .models import SavingsData
from .models import GoalPlan

class SavingsDataForm(forms.ModelForm):
    class Meta:
        model = SavingsData
        fields = ['total_income', 'subtracted_values', 'remaining_income']
        
class GoalPlanForm(forms.ModelForm):
    class Meta:
        model = SavedGoalPlan  # Link the form to your model
        fields = ['total_income', 'subtracted_values', 'remaining_income', 'savings_goal', 'monthly_percentage'] 