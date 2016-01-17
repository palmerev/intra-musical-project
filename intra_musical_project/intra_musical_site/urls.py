"""intra_musical_site URL Configuration

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
from ear_training_app import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/$', views.login_page),
    url(r'^logout/$', views.logout_page),
    url(r'^register/$', views.registration_page),
    # url(r'^courses/$', views.course_selection, name='course_selection'),
    url(r'^interval-selection/$', views.interval_selection),
    # url(r'^courses/(?P<course_type>[A-Za-z]+)/$', views.course, name='course'),
    url(r'^courses/intervals/exercises/$', views.exercise_page, name='exercise_page'),
    url(r'^courses/intervals/exercises/save-student-exercise/$', views.save_student_exercise, name='save_student_exercise'),
    url(r'^courses/(?P<course_type>[A-Za-z]+)/exercises/(?P<exercise_id>)/$', views.exercise_page, name='exercise_page'),
    url(r'^get-course-exercises/(?P<course_title>[A-Za-z]+)/$', views.get_course_exercises, name='get_course_exercises'),
    url(r'^(?P<username>\w{3,})/results/$', views.results, name='results'),

    # ---------------------------------- FOR TESTING AJAX POST -------------------------------------
    # url(r'^test/$', 'ear_training_app.views.show_test_page'),
    # url(r'^result/$', 'ear_training_app.views.test'),
    # url(r'^checkbox-page/$', 'ear_training_app.views.checkbox_page'),
]
