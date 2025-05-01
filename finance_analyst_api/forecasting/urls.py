from django.urls import path , include
from .views import FinanceModelView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'finance-model', FinanceModelView)

urlpatterns = [
    path('', include(router.urls)),
] 
