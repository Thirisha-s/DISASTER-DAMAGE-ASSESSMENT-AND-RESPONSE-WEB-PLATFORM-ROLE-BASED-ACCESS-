
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import AnalysisRequest, Region
from .serializers import (
    AnalysisRequestSerializer,
    AnalysisRequestStatusUpdateSerializer,
    RegionSerializer,
)
from .permissions import IsAdminUser, IsReliefAgent


class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


class AnalysisRequestViewSet(viewsets.ModelViewSet):
    serializer_class = AnalysisRequestSerializer

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "role", None) == "admin":
            return AnalysisRequest.objects.all()
        elif getattr(user, "role", None) == "relief":
            return AnalysisRequest.objects.filter(user=user)
        return AnalysisRequest.objects.none()

    def get_permissions(self):
        if self.action == "create":
            # ✅ Allow victims (unauthenticated users) to submit requests
            return [AllowAny()]
        elif self.action == "list":
            # ✅ Both admins & relief agents (must be logged in)
            return [IsAuthenticated()]
        elif self.action in ["update", "partial_update", "destroy", "update_status"]:
            # ✅ Only admins can update/delete/status change
            return [IsAuthenticated(), IsAdminUser()]
        elif self.action == "all":
            # ✅ Only admins can view all requests
            return [IsAuthenticated(), IsAdminUser()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        # Victims submitting without login → no user attached
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save(user=None)

    @action(detail=True, methods=["post"], url_path="update_status")
    def update_status(self, request, pk=None):
        if getattr(request.user, "role", None) != "admin":
            return Response(
                {"detail": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN,
            )

        analysis_request = self.get_object()
        serializer = AnalysisRequestStatusUpdateSerializer(
            analysis_request, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="all")
    def all(self, request):
        if getattr(request.user, "role", None) != "admin":
            return Response(
                {"detail": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN,
            )

        queryset = AnalysisRequest.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
