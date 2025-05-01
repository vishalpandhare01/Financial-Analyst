from django.urls import path , include
from .views import FinanceModelView ,PeriodView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'finance-model', FinanceModelView)
router.register(r'period', PeriodView)


urlpatterns = [
    path('', include(router.urls)),
] 
