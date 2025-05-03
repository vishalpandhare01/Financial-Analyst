from django.shortcuts import render
from rest_framework import status , permissions , generics ,viewsets ,mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import FinanceModelSerializer , PeriodModelSerializer ,ScenarioModelSerializer , LineItemModelSerializer
from .models import FinancialModel , Period , Scenario , LineItem

# finance  view
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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()  # checks ownership
        self.perform_destroy(instance)
        return Response({"detail": "Deleted successfully."}, status=status.HTTP_200_OK)

# Period view
class PeriodView(mixins.ListModelMixin,
                 mixins.RetrieveModelMixin,
                 mixins.CreateModelMixin,
                 viewsets.GenericViewSet):
    queryset = Period.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PeriodModelSerializer
    
    def get_queryset(self):
        queryset = Period.objects.all()
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        period_type = self.request.query_params.get('period_type', None)
        if period_type is not None:
            queryset = queryset.filter(period_type=period_type)
        if start_date is not None:
            queryset = queryset.filter(start_date=start_date)
        if end_date is not None:
            queryset = queryset.filter(end_date=end_date)             
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
# Scenario view
class ScenarioView(viewsets.ModelViewSet):
    queryset = Scenario.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ScenarioModelSerializer
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        queryset = Scenario.objects.all()
        model_id = self.request.query_params.get('model_id', None)
        if model_id is not None:
            queryset = queryset.filter(model_id=model_id)         
        return queryset
    
    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            return Response("You are not authorised",status=status.HTTP_403_FORBIDDEN)
        return obj
    
    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            return Response("You are not authorised",status=status.HTTP_403_FORBIDDEN)
        serializer.save()  # Save the update

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
              return Response("You are not authorised",status=status.HTTP_403_FORBIDDEN)
        instance.delete()  # Delete the instance
        return Response("deleted successfully",status=status.HTTP_200_OK)

# Line Item view
class LineItemView(viewsets.ModelViewSet):
    queryset = LineItem.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LineItemModelSerializer


