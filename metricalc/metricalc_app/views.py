from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

def index(request):
    return render(request, 'metricalc_app/index.html')

def login_view(request):
    return render(request, 'metricalc_app/login_view.html')

def registration_view(request):
    return render(request, 'metricalc_app/registration_view.html')
