from django.db import models


# Create your models here.
class Comment(models.Model):
    comment_content = models.TextField(max_length=280)
    time_posted = models.DateTimeField(auto_now_add=True)
