import uuid
from django.db import models
from accounts.models import User

class FinancialModel(models.Model):
    MODEL_TYPES = [
        ('Forecast', 'Forecast'),
        ('Budget', 'Budget'),
        ('Scenario', 'Scenario'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    version = models.CharField(max_length=50)
    model_type = models.CharField(max_length=20, choices=MODEL_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (v{self.version}) - {self.model_type}"


# -- MODEL LINE ITEMS (forecasted or scenario data)
# CREATE TABLE model_line_items (
#     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
#     model_id UUID REFERENCES models(id),
#     account_id UUID REFERENCES accounts(id),
#     entry_date DATE NOT NULL,
#     forecast_amount NUMERIC(18, 2),
#     driver_id UUID REFERENCES drivers(id), -- optional
#     created_at TIMESTAMP DEFAULT NOW()
# );
