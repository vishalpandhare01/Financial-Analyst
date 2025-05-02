from django.urls import path , include
from .views import FinanceModelView ,PeriodView ,ScenarioView ,LineItemView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'finance-model', FinanceModelView)
router.register(r'period', PeriodView)
router.register(r'scenario', ScenarioView)
router.register(r'line-item', LineItemView)



urlpatterns = [
    path('', include(router.urls)),
] 
