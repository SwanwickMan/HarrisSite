from django.shortcuts import render, redirect
from django.urls import reverse

from HarrisMclennan.forms import CommentForm
from HarrisMclennan.models import Comment


# Create your views here.
def index(request):
    search_results = Comment.objects.order_by('-time_posted')[:5]
    context_dict = {"recent_comments": search_results}
    response = render(request, 'HarrisMclennan/index.html', context=context_dict)
    return response


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
    search_results = Comment.objects.all()
    context_dict = {"search_results": search_results}
    return render(request, 'HarrisMclennan/comments_display.html', context=context_dict)


def harris_run(request):
    context_dict = {}
    return render(request, 'HarrisMclennan/harris_run.html', context=context_dict)
