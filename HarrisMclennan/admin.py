from django.contrib import admin
from .models import Comment, Scoreboard


# Register your models here.
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('comment_content', 'time_posted')  # Fields you want to display in the list view


@admin.register(Scoreboard)
class ScoreboardAdmin(admin.ModelAdmin):
    list_display = ('player_name', 'score_time', 'created_at')  # Fields you want to display in the list view