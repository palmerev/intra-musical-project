import json
import logging
from random import shuffle
from collections import defaultdict

from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt

from .models import Student, StudentExercise, Interval


logging.basicConfig(level=logging.DEBUG, filename='views.log',
                    format=' %(asctime)s - %(levelname)s - %(message)s')


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
    # TODO: validate registration against existing users
    # TODO: clean input
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


@csrf_exempt
def save_student_exercise(request):
    logging.debug('in save_student_exercise for {}'.format(request.user))
    if request.POST:
        exercise_id = request.POST["exercise_id"]
        # e.g. all lowercase "correct", "incorrect", or "skipped"
        result = request.POST["result"]
        user_exercise = StudentExercise.objects.filter(
            student__student_user=request.user, exercise__id=exercise_id)
        # the student has already seen this exercise
        if len(user_exercise) == 1:
            logging.debug(
                'result is for exercise {} is {}'.format(exercise_id, result))
            student_exercise = user_exercise[0]
        # the student hasn't seen this exercise
        elif len(user_exercise) == 0:
            logging.debug(
                'request.user.student: {}'.format(request.user.student))
            student_exercise = StudentExercise(
                student=Student(student_user=request.user),
                exercise=Interval.objects.get(pk=exercise_id))
            # update result or if newly created, set it
        logging.debug(
            'request.user.student: {}'.format(request.user.student))

        if result == 'skipped':
            student_exercise.times_skipped += 1
        elif result == 'correct':
            student_exercise.times_correct += 1
        elif result == 'incorrect':
            student_exercise.times_incorrect += 1
        else:
            logging.warning(
                'result is not "skipped", "correct", or "incorrect"')
        student_exercise.status = result
        student_exercise.save()
        logging.debug('saved result as %s, id: %s', student_exercise, student_exercise.id)
        return JsonResponse({"id": student_exercise.id})
    else:
        return JsonResponse(json.dumps("{ error: please use POST }"))


def exercise_page(request):
    return render(request, 'ear_training_app/interval_exercise.html')


def construct_interval_exercises(req, exercise_list):
    exercises = [
        {
            "intervalName": exercise.name.lower(),
            "topNote": {
                "octave": exercise.top_note.octave,
                "letterName": exercise.top_note.name.lower()
            },
            "bottomNote": {
                "octave": exercise.bottom_note.octave,
                "letterName": exercise.bottom_note.name.lower()
            },
            "exerciseId": exercise.id
        } for exercise in exercise_list]
    shuffle(exercises)

    return {
        "userAuthenticated": req.user.is_authenticated(),
        "exercises": exercises
    }


# TODO: update URL for this view (-course_title)
def get_course_exercises(request, course_title):
    exercises = Interval.objects.all()
    exercise_json = construct_interval_exercises(request, exercises)
    return JsonResponse(exercise_json)


def to_interval_names(html_names):
    '''
    Convert HTML-style names "f-bar" for intervals to full names of
    intervals, in the form "foo bar".
     '''
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
        exercises = Interval.objects.filter(name__in=interval_names)
        print("Exercise.objects.filter: ", exercises)
        interval_data = construct_interval_exercises(request, exercises)
        print("interval data: ", interval_data)
        return JsonResponse({"data": interval_data})


@login_required
def private(request, username):
    return render(request, 'ear_training_app/results_private.html', {'username': username})


@login_required
def results(request, username):
    # get user's results visibility
    private = request.user.student.results_private
    # check if the user's username matches the URL's username parameter
    # TODO: add inherited templates for results
    if username == request.user.username:
        return render(request,
            'ear_training_app/self_results.html', {'username': username})
    # a user is trying to view someone else's results page
    else:
        if private:
            return redirect('results_private', username)  # FIXME
        else:
            return render(request,
            'ear_training_app/other_user_results.html', {'username': username})  # FIXME
    interval_names = [i[0] for i in Interval.INTERVAL_TYPES]
    # get all exercises for student
    exercises = StudentExercise.objects.filter(
        student=request.user.student
    )
    nums_completed = [0 for x in interval_names]
    logging.debug(
        'inside "results": building exercises completed for %s', request.user.student
    )
    for ex in exercises:
        try:
            # logging.debug('exercise answer: {}'.format(str(ex.exercise.answer)))
            exercise_index = interval_names.index(str(ex.exercise.answer).split(',')[0])
            nums_completed[exercise_index] += ex.total_times_given()
            logging.debug('{} completed {} times'.format(
                ex.exercise.answer, nums_completed[exercise_index])
            )
        except ValueError:
            logging.debug('ValueError in "results"')
            continue
    logging.debug("\n-------\n")
    results = list(zip(interval_names, nums_completed))
    context = {
        "results": results,
        "exercises": exercises,
        "results_private": request.user.student.results_private
    }
    return render(request, 'ear_training_app/self_results.html', context)


def update_visibility(request, username):
    # get visibility value from POST
    visibility_value = json.loads(request.POST["visibility"])
    # get student by username
    updated = Student.objects.filter(student_user__username=username).update(
        results_private=visibility_value)
    # set new visibility value and save
    # if visibility_value is True, the checkbox is checked, so results should be made private
    # the checkbox is unchecked, so results should be made public
    if updated == 1:
        private = visibility_value
    else:
        return JsonResponse({"error": "error during update"})
    # return JSON response with new value
    return JsonResponse({"private": private})
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
