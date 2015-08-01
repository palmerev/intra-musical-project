from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
# Create your views here.
from .models import Note
from .models import Interval
from .models import IntervalType
from .models import Scale
from .models import ScaleType
from .models import Chord
from .models import ChordType
from .models import CourseSelection
from .models import CourseProgress
from .models import Exercise
from .models import CourseStats
from random import choice, sample, randint
import json

# @login_required(login_url='/login/')
def index(request):
    return render(request, 'ear_training_app/index.html')

def login_page(request):
    if request.POST:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect("/")
            else:
                return HttpResponse("disabled account")
        else:
            return HttpResponse("invalid login")

    return render(request, 'ear_training_app/login_page.html')

def logout_page(request):
    logout(request)
    return HttpResponseRedirect("ear_training_app/courses.html")
    # return HttpResponse("logged out!")

def registration_page(request):
    if request.POST:
        user = User()
        user.username = request.POST['username']
        user.set_password(request.POST['password'])
        user.save()
        return HttpResponseRedirect("/login/")

    return render(request, 'ear_training_app/registration_page.html')

def course_selection(request):
    print(request.user)
    print(CourseStats.objects.all()[0])
    stats = CourseStats.objects.filter(student__stuser=request.user)[0]
    # stats = CourseStats.objects.filter(user=request.user.student)
    completed = stats.exercises_complete
    total = stats.course.num_exercises
    percent_complete = completed / total
    context = {
        "completed": completed,
        "total": total,
        "percent_complete": percent_complete
        }
    return render(request, 'ear_training_app/courses.html', context)

def course(request, course_type):
    # view logic
    #
    return HttpResponse("Course Content Page")

def progress_page(request):
    return HttpResponse("Course Progress Page")

# def exercise_page(request, course_type, exercise_id):
#     return HttpResponse("Exercise Page")

num_intervals = 4

def exercise_page(request):
    #context = { "possible_answers": answer_json }
    return render(request, 'ear_training_app/interval_exercise.html')

#helper function for exercise_page
def get_interval_set(request):
    interval_list = Interval.objects.all()
    interval_set = sample(interval_list, num_intervals)
    interval_obj = [
        {
            "interval_name": interval.name.quality.lower(),
            "top_note": {
                "octave": interval.top_note.octave,
                "name": interval.top_note.name.lower()
            },
            "bottom_note": {
                "octave": interval.bottom_note.octave,
                "name": interval.bottom_note.name.lower()
            }

        } for interval in interval_set]

    answer_json = json.dumps(interval_obj)
    return HttpResponse(answer_json, content_type="application/json")

# def index(request):
#     note_list = Note.objects.order_by('-frequency')
#     template = loader.get_template('ear_training_app/index.html')
#     context = RequestContext(request, {
#         'note_list': note_list,
#     })
#     return HttpResponse(template.render(context))
#
# def note_list(request):
#     notes = Note.objects.all()
#     notes_data = [", ".join([x.name, str(x.frequency)]) for x in notes]
#     output = "\t".join(notes_data)
#     return HttpResponse(output)
#
# def detail(request, note_id):
#     note = get_object_or_404(Note, id=note_id)
#     context = { "note": note }
#     return render(request, 'ear_training_app/detail.html', context)
#
# def results(request, note_id):
#     note_list = Note.objects.order_by('-frequency')
#     chosen_note = Note.objects.filter(id=note_id)[0]
#     chosen_note.votes += 1
#     chosen_note.save()
#     context = { "note_list": note_list, "note": chosen_note }
#     return render(request, 'ear_training_app/results.html', context)
#
# def edit(request, note_id):
#     filtered_notes = Note.objects.filter(id=note_id)
#     if filtered_notes:
#         print "notes in edit"
#         note = filtered_notes[0]
#     else:
#         #note = Note()
#         print "NO NOTES!"
#     if request.POST:
#         print(request.POST)
#         note.name = request.POST["name"]
#         note.votes = request.POST["votes"]
#         note.save()
#         return HttpResponseRedirect("/")
#
#     context = { "note": note }
#     return render(request, 'ear_training_app/edit.html', context)
