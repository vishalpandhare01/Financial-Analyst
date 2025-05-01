from rest_framework import serializers
from .models import FinancialModel


class FinanceModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialModel
        fields = ['id', 'name', 'version', 'model_type', 'created_at']
        
