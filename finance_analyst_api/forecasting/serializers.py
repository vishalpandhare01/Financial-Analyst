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
    model = FinanceModelSerializer(read_only=True)
    model_id = serializers.PrimaryKeyRelatedField(
        queryset=FinancialModel.objects.all(), source='model', write_only=True
    )
    class Meta:
        model = Scenario
        fields = ['id' , 'name' , 'description' ,'model' , 'model_id']

class LineItemModelSerializer(serializers.ModelSerializer):
    model = FinanceModelSerializer(read_only=True)
    model_id = serializers.PrimaryKeyRelatedField(
        queryset=FinancialModel.objects.all(), source='model', write_only=True
    )
    
    scenario = ScenarioModelSerializer(read_only=True)
    scenario_id = serializers.PrimaryKeyRelatedField(
        queryset=Scenario.objects.all(), source='scenario', write_only=True
    )
    
    period = PeriodModelSerializer(read_only=True)
    period_id = serializers.PrimaryKeyRelatedField(
        queryset=Period.objects.all(), source='period', write_only=True
    )
        
    class Meta:
        model = LineItem
        fields = ['name' , 'category' , 'amount' , 'model_id' ,'model' , 'scenario_id' , 'scenario' , 'period_id' , 'period']
        