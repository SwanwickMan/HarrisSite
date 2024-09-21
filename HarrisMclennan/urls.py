from django.urls import path
from HarrisMclennan import views
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path, include
from django.contrib import admin

app_name = "HarrisMclennan"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('add_comment/', views.add_comment, name='add_comment'),
    path('comments/', views.comments_display, name='comments_display'),
    path('harrisrun/', views.harris_run, name='harris_run'),
]

