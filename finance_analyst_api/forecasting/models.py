# modelsheet/models.py

from django.db import models
from accounts.models import User  # assuming you have custom users

# Periods (Monthly, Quarterly, Yearly)
class Period(models.Model):
    PERIOD_TYPES = [
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ]
    label = models.CharField(max_length=20)  # e.g., 'Jan 2025'
    start_date = models.DateField()
    end_date = models.DateField()
    period_type = models.CharField(max_length=20, choices=PERIOD_TYPES)

    def __str__(self):
        return f"{self.label} ({self.period_type})"

# Main financial model (e.g., Budget v1, Forecast v2)
class FinancialModel(models.Model):
    MODEL_TYPES = [
        ('DCF', 'Discounted Cash Flow'),
        ('Forecast', 'Forecast Model'),
        ('Budget', 'Budgeting Model'),
        ('Scenario', 'Scenario Analysis'),
        ('CashFlow', 'Cash Flow Model'),
        ('Valuation', 'Valuation Model'),
        ('LBO', 'Leveraged Buyout Model'),
        ('M&A', 'M&A Model'),
        ('Sensitivity', 'Sensitivity Analysis'),
        ('BreakEven', 'Break-Even Model'),
        ('KPI', 'KPI Dashboard'),
        ('3Statement', '3-Statement Model'),
        ('Rolling', 'Rolling Forecast'),
        ('CapTable', 'Capitalization Table'),
        ('MonteCarlo', 'Monte Carlo Simulation'),
        ('IRR', 'Internal Rate of Return Model'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    version = models.CharField(max_length=50)
    model_type = models.CharField(max_length=20, choices=MODEL_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (v{self.version}) - {self.model_type}"

# Scenarios (Base, Worst Case, Best Case)
class Scenario(models.Model):
    model = models.ForeignKey(FinancialModel, on_delete=models.CASCADE, related_name='scenarios')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.model.name} - {self.name}"

# Line Items: Revenue, Expenses, etc.
class LineItem(models.Model):
    CATEGORY_CHOICES = [
        ('Revenue', 'Revenue'),
        ('Expense', 'Expense'),
        ('Asset', 'Asset'),
        ('Liability', 'Liability'),
        ('Equity', 'Equity'),
        ('Other', 'Other'),
    ]

    model = models.ForeignKey(FinancialModel, on_delete=models.CASCADE, related_name='line_items')
    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE)
    period = models.ForeignKey(Period, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    # currency  choice field :To Do

    def __str__(self):
        return f"{self.name} - {self.period.label}: ${self.amount}"

# Assumptions
class Assumption(models.Model):
    model = models.ForeignKey(FinancialModel, on_delete=models.CASCADE, related_name='assumptions')
    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)  # e.g., Growth Rate
    value = models.DecimalField(max_digits=10, decimal_places=4)
    unit = models.CharField(max_length=20, default='%')  # %, $, ratio

    def __str__(self):
        return f"{self.name} ({self.value}{self.unit})"
