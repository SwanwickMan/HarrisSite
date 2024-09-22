from django import forms
from HarrisMclennan.models import Comment, Scoreboard


class CommentForm(forms.ModelForm):
    comment_content = forms.CharField(required=True,
                                      help_text="Type comment here.",
                                      widget=forms.Textarea(attrs={'cols': 40, 'rows': 5}),
                                      )

    class Meta:
        model = Comment
        fields = ('comment_content',)


class ScoreboardForm(forms.ModelForm):
    class Meta:
        model = Scoreboard
        fields = ['player_name', 'score_time']
