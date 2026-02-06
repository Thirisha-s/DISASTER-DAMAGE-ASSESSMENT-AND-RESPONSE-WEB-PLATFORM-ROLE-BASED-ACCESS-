from django.db import models
from django.conf import settings
from django.utils import timezone


class Region(models.Model):
    name = models.CharField(max_length=100)
    

    def __str__(self):
        return self.name

class AnalysisRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('RUNNING', 'Running'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='analysis_requests')
    area_geojson = models.JSONField(help_text="GeoJSON defining the requested area")
    date_before = models.DateField()
    date_after = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    requested_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    result_file = models.FileField(upload_to='results/', null=True, blank=True)

    def __str__(self):
        return f"Request {self.id} by {self.user.username} - {self.status}"

