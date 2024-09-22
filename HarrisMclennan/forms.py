from django import forms
from HarrisMclennan.models import Comment


class CommentForm(forms.ModelForm):
    comment_content = forms.CharField(required=True,
                                      help_text="Type comment here.",
                                      widget=forms.Textarea(attrs={'cols': 40, 'rows': 5}),
                                      )

    class Meta:
        model = Comment
        fields = ('comment_content',)
