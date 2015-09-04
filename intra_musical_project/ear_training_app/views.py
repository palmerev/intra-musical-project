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
from .models import ExerciseStatus
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

def registration_page(request):
    #TODO: validate registration against existing users?
    if request.POST:
        user = User()
        user.username = request.POST['username']
        user.set_password(request.POST['password'])
        user.save()
        student = Student()
        student.stuser = user
        student.save()
        return HttpResponseRedirect("/login/")

    return render(request, 'ear_training_app/registration_page.html')

@login_required(login_url="/login/")
def course_selection(request):
    if(request.user.is_authenticated()):
        context = {}
        user_stats = CourseStats.objects.filter(student__stuser=request.user)
        print user_stats
        if len(user_stats) == 0:
            context["course"] = "new"
        else:
            for stat in user_stats:
                if stat.course.course_type.title == "Intervals":
                    context["course"] = "intervals"
                    context["intervals_completed"] = stat.exercises_complete
                    context["intervals_total"] = stat.course.num_exercises
                    context["intervals_percent_complete"] = stat.exercises_complete / stat.course.num_exercises
                elif stat.course.course_type.title == "Scales":
                    context["course"] = "scales"
                    context["scales_completed"] = stat.exercises_complete
                    context["scales_total"] = stat.course.num_exercises
                    context["scales_percent_complete"] = stat.exercises_complete / stat.course.num_exercises
                elif stat.course.course_type.title == "Chords":
                    context["course"] = "chords"
                    context["chords_completed"] = stat.exercises_complete
                    context["chords_total"] = stat.course.num_exercises
                    context["chords_percent_complete"] = stat.exercises_complete / stat.course.num_exercises
                else:
                    raise ValueError("Unknown course type in user_stats.")
    else:
        context = {}
    return render(request, 'ear_training_app/courses.html', context)

@csrf_exempt
def save_student_exercise(request):
    if request.POST:
        print "request.POST:", request.POST
        exercise_id = request.POST["exercise_id"]
        # result should be formatted to match EXERCISE_RESULT_CHOICES in StudentExercise model
        # e.g. all lowercase "correct", "incorrect", or "skipped"
        result = request.POST["result"]
        user_exercise = StudentExercise.objects.filter(student__stuser=request.user, exercise__id=exercise_id)
        if len(user_exercise) > 0:
            student_exercise = user_exercise[0]
            student_exercise.save()
        else:
            curr_student = Student()
            curr_student.stuser = request.user
            student_exercise = StudentExercise()
            student_exercise.student = curr_student
            # student_exercise.student.stuser = request.user
            student_exercise.exercise = Exercise.objects.order_by('-id').filter(id=exercise_id)[0]
            # update result or if newly created, set it
            se_stat = ExerciseStatus()
            se_stat.status = result
            se_stat.save()
            student_exercise.result = se_stat
            student_exercise.save()
        return HttpResponse('{ "id": ' + str(student_exercise.id) + ' }', content_type="application/json")
    else:
        return HttpResponse(json.dumps("{ error: please use POST }"), content_type="application/json")

def api_all_student_exercises(request):
    student_exercises = StudentExercise.objects.filter(student__stuser=request.user)
    print "StudentExercises:", student_exercises
    if(len(student_exercises) > 0):
        obj = [
            {
                "user": se.student.stuser.username,
                "exercise_id": se.exercise.id,
                "exercise_result": se.result.status
            }
            for se in student_exercises]
        return HttpResponse(json.dumps(obj), content_type="application/json")
    else:
        print "no StudentExercises for student"
        return HttpResponse(json.dumps(
            "{ error: no StudentExercises for Student }"
            ), content_type="application/json")

def course(request, course_type):
    # view logic
    #
    return HttpResponse("Course Content Page")

# def progress_page(request):
#     return HttpResponse("Course Progress Page")

def exercise_page(request):
    return render(request, 'ear_training_app/interval_exercise.html')

#TODO: currently only works for interval exercises
def get_course_exercises(request, course_title):
    course_title = course_title.capitalize()
    exercises = Exercise.objects.filter(course__course_type__title=course_title)
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

def create_course_stats(request, course_title):
    course_title = course_title.capitalize()
    user_stats = CourseStats.objects.filter(
        course__course_type__title=course_title,
        student__stuser=request.user
        )
    if len(user_stats) > 0:
        print "CourseStats already exist for ", course_title, ":", request.user.username
    else:
        new_stats = CourseStats()
        new_stats.student = request.user.student
        new_stats.course = Course.objects.filter(course_type__title=course_title)[0]
        new_stats.save()
@csrf_exempt
def test_checkboxes(request):
    if request.POST:
        print request.POST
    return HttpResponse("Yay checkboxes!")

def checkbox_page(request):
    return render(request, 'ear_training_app/checkbox_page.html')
