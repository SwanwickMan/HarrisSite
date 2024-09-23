import os

from django.http import JsonResponse, FileResponse, HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_protect, csrf_exempt

from HarrisMclennan.forms import CommentForm, ScoreboardForm
from HarrisMclennan.models import Comment, Scoreboard


# Create your views here.
def index(request):
    search_results = Comment.objects.order_by('-time_posted')[:5]
    context_dict = {"recent_comments": search_results}
    response = render(request, 'HarrisMclennan/index.html', context=context_dict)
    return response


def scoreboard(request):
    search_results = Scoreboard.objects.order_by('-score_time')
    context_dict = {"scoreboard_entries": search_results}
    response = render(request, 'HarrisMclennan/scoreboard.html', context=context_dict)
    return response


@csrf_exempt
def add_comment(request):
    form = CommentForm()

    if request.method == 'POST':
        form = CommentForm(request.POST, request.FILES)
        if form.is_valid():
            comment = form.save()
            return redirect(reverse('HarrisMclennan:comments_display'))
        else:
            print(form.errors)

    return render(request, 'HarrisMclennan/add_comment.html', {'form': form})


def comments_display(request):
    search_results = Comment.objects.order_by('-time_posted')
    context_dict = {"search_results": search_results}
    return render(request, 'HarrisMclennan/comments_display.html', context=context_dict)


def harris_run(request):
    context_dict = {}
    return render(request, 'HarrisMclennan/harris_run.html', context=context_dict)


def harris_jerk(request):
    context_dict = {}
    return render(request, 'HarrisMclennan/harris_jerk.html', context=context_dict)


def save_to_scoreboard(request):
    if request.method == 'POST':
        form = ScoreboardForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success', 'message': 'Data saved successfully'})
        else:
            return JsonResponse({'status': 'error', 'message': form.errors})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


def send_robot_txt(request):
    response = "User-agent: *\nAllow: /"
    return HttpResponse(response, content_type='text/plain')
