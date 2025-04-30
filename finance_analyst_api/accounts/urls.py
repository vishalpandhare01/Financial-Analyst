from django.urls import path
from .views import RegisterView, LoginView, UserProfileView , UpdateUserView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/update', UpdateUserView.as_view(), name='update'),
]
