from django.shortcuts import render
from rest_framework import status , permissions , generics ,viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import FinanceModelSerializer , PeriodModelSerializer
from .models import FinancialModel , Period

class FinanceModelView(viewsets.ModelViewSet):
    queryset = FinancialModel.objects.all()
    serializer_class = FinanceModelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically assign the logged-in user
        serializer.save(user=self.request.user)

    def get_queryset(self):
        # Return only models belonging to the logged-in user
        return FinancialModel.objects.filter(user=self.request.user)
    
    def get_object(self):
        # Override to ensure users can only access their own FinancialModel instances
        obj = super().get_object()
        if obj.user != self.request.user:
            raise permissions.PermissionDenied("You do not have permission to access this resource.")
        return obj
    
    def perform_update(self, serializer):
        # Here, you can add custom logic before updating the model
        # For example, we could ensure that only the owner can update
        if serializer.instance.user != self.request.user:
            raise permissions.PermissionDenied("You cannot update someone else's financial model.")
        serializer.save()  # Save the update

    def perform_destroy(self, instance):
        # Here, you can add custom logic before deletion
        if instance.user != self.request.user:
            raise permissions.PermissionDenied("You cannot delete someone else's financial model.")
        instance.delete()  # Delete the instance
        return Response("deleted successfully",status=status.HTTP_200_OK)
     
class PeriodView(viewsets.ModelViewSet):
    queryset = Period.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PeriodModelSerializer
    
    def get_queryset(self):
        """
        Optionally restricts the returned periods by filtering against
        a `period_type` query parameter in the URL.
        """
        queryset = Period.objects.all()
        period_type = self.request.query_params.get('period_type', None)
        if period_type is not None:
            queryset = queryset.filter(period_type=period_type)  # Example filter
        return queryset

    def perform_create(self, serializer):
        return serializer.save()
    