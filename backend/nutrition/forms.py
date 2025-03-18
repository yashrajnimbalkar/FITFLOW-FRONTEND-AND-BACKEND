# diet_recommendation/forms.py
from django import forms
from .models import UserInput

class DietRecommendationForm(forms.ModelForm):
    GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')]
    DIET_CHOICES = [('Veg', 'Veg'), ('Non-Veg', 'Non-Veg'), ('Veg & Non-Veg', 'Veg & Non-Veg')]
    GOAL_CHOICES = [
        ('Gain muscles', 'Gain muscles'),
        ('Lose weight', 'Lose weight'),
        ('Maintain physique', 'Maintain physique')
    ]

    gender = forms.ChoiceField(choices=GENDER_CHOICES)
    veg_or_nonveg = forms.ChoiceField(choices=DIET_CHOICES)
    goal = forms.ChoiceField(choices=GOAL_CHOICES)

    class Meta:
        model = UserInput
        exclude = ['created_at']
        widgets = {
            'disease': forms.Textarea(attrs={'rows': 3}),
            'allergics': forms.Textarea(attrs={'rows': 3}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs.update({
                'class': 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500'
            })