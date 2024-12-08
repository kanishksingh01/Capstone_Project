# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("", views.landing_page, name="index"),
    path("plan1/", views.plan1, name="plan1"),
    path("about/", views.about, name="about"),
    path("plan2/", views.plan2, name="plan2"),
    path("login/", views.login_view, name="login"),
    path("create_account/", views.create_account_view, name="create_account"),
    path("logout/", views.logout_view, name="logout"),
    path("savings/", views.savings_view, name="savings"),
    path("fetch_goal_plan_data/", views.fetch_goal_plan_data, name="fetch_goal_plan_data"),  
    path("save_goal_plan_data/", views.save_goal_plan_data, name="save_goal_plan_data"),
    path('fetch_saved_data/', views.fetch_saved_data, name='fetch_saved_data'),

    # Other paths
]