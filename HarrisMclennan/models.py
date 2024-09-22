from django.db import models


# Create your models here.
class Comment(models.Model):
    comment_content = models.TextField(max_length=280)
    time_posted = models.DateTimeField(auto_now_add=True)


class Scoreboard(models.Model):
    player_name = models.CharField(max_length=100)
    score_time = models.DurationField()  # Store the length of time
    created_at = models.DateTimeField(auto_now_add=True)  # Track when the score was submitted

    def __str__(self):
        return f"{self.player_name}: {self.score_time}"

    def get_formatted_time(self):
        # Return the score time in a human-readable format (HH:MM:SS)
        total_seconds = int(self.score_time.total_seconds())
        hours, remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return f"{hours:02}:{minutes:02}:{seconds:02}"
