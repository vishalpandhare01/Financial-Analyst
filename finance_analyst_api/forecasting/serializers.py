from rest_framework import serializers
from .models import FinancialModel , Period , Scenario , LineItem


class FinanceModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialModel
        fields = ['id', 'name', 'version', 'model_type', 'created_at']
        
class PeriodModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = ['id' , 'label', 'start_date' , 'end_date' , 'period_type']

class ScenarioModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scenario
        fields = ['id' , 'name' , 'description']

class LineItemModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LineItem
        fields = ['name' , 'category' , 'amount']
        