import uuid
from django.db import models
from accounts.models import User

class FinancialModel(models.Model):
    MODEL_TYPES = [
        ('DCF', 'DCF'),
        ('Forecast', 'Forecast'),
        ('Budget', 'Budget'),
        ('Scenario', 'Scenario'),
        ('CashFlow', 'CashFlow'),
        ('Valuation', 'Valuation'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    version = models.CharField(max_length=50)
    model_type = models.CharField(max_length=20, choices=MODEL_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (v{self.version}) - {self.model_type}"


# CREATE TABLE reporting_periods (
#     period_id SERIAL PRIMARY KEY,
#     company_id INT NOT NULL,
#     period_start DATE NOT NULL,
#     period_end DATE NOT NULL,
#     is_forecast BOOLEAN DEFAULT FALSE,
#     FOREIGN KEY (company_id) REFERENCES companies(company_id)
# );

# CREATE TABLE statement_types (
#     statement_type_id SERIAL PRIMARY KEY,
#     name VARCHAR(100) NOT NULL  -- e.g. 'Income Statement', 'Balance Sheet', 'Cash Flow'
# );

# CREATE TABLE financial_metrics (
#     metric_id SERIAL PRIMARY KEY,
#     name VARCHAR(255) NOT NULL,
#     statement_type_id INT,
#     unit VARCHAR(50) DEFAULT 'USD',
#     FOREIGN KEY (statement_type_id) REFERENCES statement_types(statement_type_id)
# );


# CREATE TABLE financial_facts (
#     fact_id SERIAL PRIMARY KEY,
#     company_id INT NOT NULL,
#     period_id INT NOT NULL,
#     metric_id INT NOT NULL,
#     value DECIMAL(20, 4),
#     FOREIGN KEY (company_id) REFERENCES companies(company_id),
#     FOREIGN KEY (period_id) REFERENCES reporting_periods(period_id),
#     FOREIGN KEY (metric_id) REFERENCES financial_metrics(metric_id)
# );
