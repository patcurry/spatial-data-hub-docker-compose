from django import forms

from keywords.models import Keyword


class KeywordCreateForm(forms.ModelForm):
    """
    This form will be used to create keywords and to associate datasets
    with keywords... maybe
    """
    class Meta:
        model = Keyword

        fields = ["keyword"]
