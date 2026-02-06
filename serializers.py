from rest_framework import serializers
from .models import AnalysisRequest, Region  

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'


class AnalysisRequestSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = AnalysisRequest
        fields = '__all__'
        read_only_fields = ['status', 'requested_at', 'updated_at', 'result_file']


class AnalysisRequestStatusUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = AnalysisRequest
        fields = ['status']  # Only allow updating 'status'

    def validate_status(self, value):
        valid_statuses = [choice[0] for choice in AnalysisRequest.STATUS_CHOICES]
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        return value
