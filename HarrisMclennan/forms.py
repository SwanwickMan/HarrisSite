from django import forms
from HarrisMclennan.models import Comment


class CommentForm(forms.ModelForm):
    comment_content = forms.CharField(required=True,
                                      help_text="Type comment here.")

    class Meta:
        model = Comment
        fields = ('comment_content',)
