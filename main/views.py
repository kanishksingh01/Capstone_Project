from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import SavingsData, GoalPlan
import json
from django.urls import reverse

# Create your views here.
def landing_page(request):
    return render(request, 'student_saver.html')

@login_required
def plan1(request):
    user = request.user
    savings_data = SavingsData.objects.filter(user=user)
    return render(request, 'savings.html', {'savings_data': savings_data})

def about(request):
    return render(request, 'about.html')

@csrf_exempt
@login_required
def plan2(request):
    return render(request, 'plan2.html')

# Save Goal Plan Data (POST)
@csrf_exempt
@login_required
def save_goal_plan_data(request):
    if request.method == 'POST':
        try:
            total_income = float(request.POST.get('total_income', 0))
            subtracted_values = request.POST.get('subtracted_values', '[]')
            remaining_income = float(request.POST.get('remaining_income', 0))
            savings_goal = float(request.POST.get('savings_goal', 0))
            monthly_percentage = float(request.POST.get('monthly_percentage', 0))
            goal_percentage = float(request.POST.get('goal_percentage', 0.0))  # New field

            print("Received data:", total_income, subtracted_values, remaining_income, savings_goal, monthly_percentage, goal_percentage)

            GoalPlan.objects.create(
                user=request.user,  # Set the user field
                total_income=total_income,
                subtracted_values=subtracted_values,
                remaining_income=remaining_income,
                savings_goal=savings_goal,
                monthly_percentage=monthly_percentage,
                goal_percentage=goal_percentage  # Save new field
            )

            return JsonResponse({'message': 'Data saved successfully!'}, status=200)
        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

# Fetch Goal Plan Data (GET)
from django.http import JsonResponse
from .models import GoalPlan

def fetch_goal_plan_data(request):
    try:
        # Query the data (adjust based on your model fields)
        goal_plans = GoalPlan.objects.filter(user=request.user).all().values(
            'total_income', 
            'subtracted_values', 
            'remaining_income', 
            'savings_goal', 
            'created_at'
        )
        return JsonResponse(list(goal_plans), safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

from django.http import JsonResponse
from .models import SavingsData  # Adjust the import based on your actual model name

def fetch_saved_data(request):
    try:
        # Query the data (adjust based on your model fields)
        savings_data = SavingsData.objects.filter(user=request.user).all().values(
            'total_income', 
            'subtracted_values', 
            'remaining_income', 
            'created_at'
        )
        return JsonResponse(list(savings_data), safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('index')  # Redirect to the home page or another page after successful login
        else:
            return render(request, 'login.html', {'error_message': 'Invalid username or password'})
    return render(request, 'login.html')

def create_account_view(request):
    if request.method == 'POST':
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        username = request.POST['new_username']
        email = request.POST['email']
        password = request.POST['new_password']
        confirm_password = request.POST['confirm_password']

        if password != confirm_password:
            return render(request, 'create_account.html', {'error_message': 'Passwords do not match'})

        if User.objects.filter(username=username).exists():
            return render(request, 'create_account.html', {'error_message': 'Username already exists'})

        user = User.objects.create_user(username=username, email=email, password=password)
        user.first_name = first_name
        user.last_name = last_name
        user.save()

        login(request, user)
        return redirect('index')  # Redirect to the home page or another page after successful account creation

    return render(request, 'create_account.html')

def logout_view(request):
    # Log the user out
    logout(request)
    # Optional: Add a success message
    messages.success(request, 'You have been logged out successfully.')
    # Redirect to the desired page, e.g., the landing page
    return redirect('index')  # Adjust the redirect as needed

@csrf_exempt
@login_required
def savings_view(request):
    if request.method == 'POST':
        try:
            total_income = float(request.POST.get('total_income', 0.0))
            subtracted_values = request.POST.get('subtracted_values', '[]')
            remaining_income = float(request.POST.get('remaining_income', 0.0))

            # Validate and parse subtracted_values
            try:
                subtracted_values = json.loads(subtracted_values)
            except json.JSONDecodeError:
                subtracted_values = []

            # Save the data to the database
            SavingsData.objects.create(
                user=request.user,
                total_income=total_income,
                subtracted_values=subtracted_values,
                remaining_income=remaining_income
            )
            return JsonResponse({'status': 'success'})
        except (ValueError, TypeError) as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return render(request, 'savings.html')