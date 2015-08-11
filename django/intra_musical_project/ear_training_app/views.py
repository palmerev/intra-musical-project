from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
from .models import Note
from .models import Interval
from .models import IntervalType
from .models import Scale
from .models import ScaleType
from .models import Chord
from .models import ChordType
from .models import Exercise
from .models import CourseStats
from .models import Student
from .models import StudentExercise
from random import choice, sample, randint
import json

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
    return HttpResponseRedirect("/")
    # return HttpResponse("logged out!")

def registration_page(request):
    #TODO: validate registration against existing users
    if request.POST:
        user = User()
        #all_users = User.objects.all()
        user.username = request.POST['username']
        user.set_password(request.POST['password'])
        user.save()
        return HttpResponseRedirect("/login/")

    return render(request, 'ear_training_app/registration_page.html')

@login_required(login_url="/login/")
def course_selection(request):
    if(request.user.is_authenticated()):
        # print(request.user)
        # print(CourseStats.objects.all()[0])
        stats = get_object_or_404(CourseStats, student__stuser=request.user)
        # stats = CourseStats.objects.filter(stuser=request.user.student)[0]
        completed = stats.exercises_complete
        total = stats.course.num_exercises
        percent_complete = completed / total
        context = {
            "completed": completed,
            "total": total,
            "percent_complete": percent_complete
            }
    else:
        context = {}
    return render(request, 'ear_training_app/courses.html', context)

@csrf_exempt
def complete_exercise(request):
    if request.POST:
        print(request.POST)
        result = request.POST["result"]
        stats = get_object_or_404(CourseStats, student__stuser=request.user)
        student = get_object_or_404(Student, pk=request.user.id)
        if result == "correct":
            stats.num_correct += 1
            student.total_exercises_completed += 1
        elif result == "incorrect":
            stats.num_incorrect += 1
            student.total_exercises_completed += 1
        elif result == "skipped":
            stats.num_skipped += 1
        stats.save()
        student.save()
        data = {
            "num_correct": stats.num_correct,
            "num_incorrect": stats.num_incorrect,
            # "num_skipped": stats.num_skipped,
            "total_answered": stats.num_correct + stats.num_incorrect
        }
        json_data = json.dumps(data, indent=4)
        return HttpResponse(json_data, content_type="application/json")
    else:
        return HttpResponse(json.dumps("{ error: please use POST }"), content_type="application/json")

def save_student_exercise(request):
    if request.POST:
        exercise_id = request.POST["exercise_id"]
        # result should be formatted to match EXERCISE_RESULT_CHOICES in StudentExercise model
        # e.g. all lowercase "correct", "incorrect", or "skipped"
        result = request.POST["result"]
        user_exercise = StudentExercise.objects.filter(student__stuser=request.user, exercise__id=exercise.id)[0]
        if len(user_exercises) > 0:
            student_exercise = user_exercise
        else:
            student_exercise = StudentExercise()
            student_exercise.student = request.user
            student_exercise.exercise = Exercise.objects.filter(id=exercise_id)[0]
        # update result or if newly created, set it
        student_exercise.result = result
        student_exercise.save()
        return HttpResponse(json.dumps('{ "id": ' + student_exercise.id + ' }'), content_type="application/json")
    else:
        return HttpResponse(json.dumps("{ error: please use POST }"), content_type="application/json")

def course(request, course_type):
    # view logic
    #
    return HttpResponse("Course Content Page")

# def progress_page(request):
#     return HttpResponse("Course Progress Page")

def exercise_page(request):
    return render(request, 'ear_training_app/interval_exercise.html')

#helper function for exercise_page
def get_interval_set(request):
    num_intervals = 4
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
            },

        } for interval in interval_set]

    answer_json = json.dumps(interval_obj)
    return HttpResponse(answer_json, content_type="application/json")

def get_course_exercises(request, course_title):
    # print course_title
    course_title = course_title.capitalize()
    exercises = Exercise.objects.filter(course__course_type__title=course_title)
    # print exercises
    obj = [
        {
            "interval_name": exercise.interval_answer.name.quality.lower(),
            "top_note": {
                "octave": exercise.interval_answer.top_note.octave,
                "name": exercise.interval_answer.top_note.name.lower()
            },
            "bottom_note": {
                "octave": exercise.interval_answer.bottom_note.octave,
                "name": exercise.interval_answer.bottom_note.name.lower()
            },
            "id": exercise.id
        } for exercise in exercises]
    return HttpResponse(json.dumps(obj, indent=4), content_type="application/json")
