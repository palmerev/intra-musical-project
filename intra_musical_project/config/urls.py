"""intramusical URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from ear_training import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/$', views.login_page),
    url(r'^logout/$', views.logout_page),
    url(r'^register/$', views.registration_page),
    url(r'^interval-selection/$', views.interval_selection),
    url(r'^courses/intervals/exercises/$', views.exercise_page, name='exercise_page'),
    url(r'^courses/intervals/exercises/save-student-exercise/$', views.save_student_exercise, name='save_student_exercise'),
    url(r'^get-course-exercises/(?P<course_title>[A-Za-z]+)/$', views.get_course_exercises, name='get_course_exercises'),
    url(r'^(?P<username>\w{3,})/results/$', views.results, name='results'),
    url(r'^(?P<username>\w{3,})/results/private/$', views.private, name='results_private'),
    url(r'^(?P<username>\w{3,})/update-visibility/$', views.update_visibility, name='update-visibility'),

    # ---------------------------------- FOR TESTING AJAX POST -------------------------------------
    # url(r'^test/$', 'ear_training.views.show_test_page'),
    # url(r'^result/$', 'ear_training.views.test'),
    # url(r'^checkbox-page/$', 'ear_training.views.checkbox_page'),
]
