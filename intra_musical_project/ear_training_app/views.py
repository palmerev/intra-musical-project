import json
from random import shuffle

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt

from .models import Exercise
from .models import Course
from .models import CourseStats
from .models import Student
from .models import StudentExercise
from .models import ExerciseStatus


def index(request):
    if request.user.is_authenticated():
        return render(request, 'ear_training_app/interval_exercise.html')
    else:
        return HttpResponseRedirect('/login/')


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
            return HttpResponseRedirect("/register/")

    return render(request, 'ear_training_app/login_page.html')


def logout_page(request):
    logout(request)
    return HttpResponseRedirect("/")


def registration_page(request):
    # TODO: validate registration against existing users?
    if request.POST:
        user = User()
        user.username = request.POST['username']
        user.set_password(request.POST['password'])
        user.save()
        student = Student()
        student.student_user = user
        student.save()
        return HttpResponseRedirect("/login/")
    return render(request, 'ear_training_app/registration_page.html')


@login_required(login_url="/login/")
def course_selection(request):
    if(request.user.is_authenticated()):
        context = {}
        user_stats = CourseStats.objects.filter(student__student_user=request.user)
        print(user_stats)
        if len(user_stats) == 0:
            context["course"] = "new"
        else:
            for stat in user_stats:
                if stat.course.course_type.title == "Intervals":
                    context["course"] = "intervals"
                    context["intervalsCompleted"] = stat.exercises_complete
                    context["intervalsTotal"] = stat.course.num_exercises
                    context["intervalsPercentComplete"] = stat.exercises_complete / stat.course.num_exercises
                else:
                    raise ValueError("Unknown course type in user_stats.")
    else:
        context = {}
    return render(request, 'ear_training_app/courses.html', context)


@csrf_exempt
def save_student_exercise(request):
    if request.POST:
        print("request.POST:", request.POST)
        exercise_id = request.POST["exercise_id"]
        # result should be formatted to match STATUSES in ExerciseStatus model
        # e.g. all lowercase "correct", "incorrect", or "skipped"
        result = request.POST["result"]
        user_exercise = StudentExercise.objects.filter(student__student_user=request.user, exercise__id=exercise_id)
        if len(user_exercise) > 0:
            student_exercise = user_exercise[0]
            student_exercise.save()
        else:
            curr_student = Student()
            curr_student.student_user = request.user
            student_exercise = StudentExercise()
            student_exercise.student = curr_student
            # student_exercise.student.student_user = request.user
            student_exercise.exercise = Exercise.objects.order_by('-id').filter(id=exercise_id)[0]
            # update result or if newly created, set it
            se_stat = ExerciseStatus()
            se_stat.status = result
            se_stat.save()
            student_exercise.result = se_stat
            student_exercise.save()
        return JsonResponse({"id": student_exercise.id})
    else:
        return JsonResponse(json.dumps("{ error: please use POST }"))


def exercise_page(request):
    return render(request, 'ear_training_app/interval_exercise.html')


def construct_interval_exercises(req, exercise_list):
    exercises = [
        {
            "intervalName": exercise.answer.name.quality.lower(),
            "topNote": {
                "octave": exercise.answer.top_note.octave,
                "letterName": exercise.answer.top_note.name.lower()
            },
            "bottomNote": {
                "octave": exercise.answer.bottom_note.octave,
                "letterName": exercise.answer.bottom_note.name.lower()
            },
            "exerciseId": exercise.id
        } for exercise in exercise_list]
    shuffle(exercises)

    return {
        "userAuthenticated": req.user.is_authenticated(),
        "exercises": exercises
    }


# TODO: currently only works for interval exercises
def get_course_exercises(request, course_title):
    course_title = course_title.capitalize()
    exercises = Exercise.objects.filter(course__course_type__title=course_title)
    exercise_json = construct_interval_exercises(request, exercises)
    return JsonResponse(exercise_json)


def create_course_stats(request, course_title):
    course_title = course_title.capitalize()
    user_stats = CourseStats.objects.filter(
        course__course_type__title=course_title,
        student__student_user=request.user
    )
    if len(user_stats) > 0:
        print("CourseStats already exist for ", course_title, ":", request.user.username)
    else:
        new_stats = CourseStats()
        new_stats.student = request.user.student
        new_stats.course = Course.objects.filter(course_type__title=course_title)[0]
        new_stats.save()


# ------------------------------------------------------------------------------
# converts HTML-style names ("foo-bar") for intervals to full names
# of intervals, in the form "foo bar"
# ------------------------------------------------------------------------------
def to_interval_names(html_names):
    # print("html_names", html_names)
    i_names = []
    for name in html_names:
        if name.startswith("min") or name.startswith("maj"):
            i_name = name.replace("-", "or ")
        elif name.startswith("per"):
            i_name = name.replace("-", "fect ")
        else:
            i_name = name
        i_names.append(i_name)
    print(i_names)
    return i_names


# IN query example for reference
# Entry.objects.filter(id__in=[1, 3, 4])
@csrf_exempt
def interval_selection(request):
    if request.POST:
        print("POST to interval_selection:", request.POST)
        # get list of intervals that match names in list
        # selected = request.POST["html_names"].split(" ")
        # interval_names = to_interval_names(selected)
        interval_names = request.POST["html_names"].split(",")
        print("interval_names", interval_names)
        exercises = Exercise.objects.filter(answer__name__quality__in=interval_names)
        print("Exercise.objects.filter: ", exercises)
        interval_data = construct_interval_exercises(request, exercises)
        print("interval data: ", interval_data)
        return JsonResponse({"data": interval_data})


# -----------------------------------------------------------------------------
# test views for AJAX post
# -----------------------------------------------------------------------------
# def show_test_page(request):
#     return render(request, 'ear_training_app/test.html')
#
# @csrf_exempt
# def test_checkboxes(request):
#     if request.POST:
#         print(request.POST)
#         return HttpResponse("Yay checkboxes!")
#
# @csrf_exempt
# def test(request):
#     if request.POST:
#         print("POST:",request.POST)
#         html_names = [key for key in request.POST.keys() if key != 'csrfmiddlewaretoken']
#         interval_names = to_interval_names(html_names)
#         return JsonResponse({ "interval_names": interval_names })
