from rest_framework import status, generics
from rest_framework.response import Response
from .serializers import UserRegistrationSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]  # Allow any user (no authentication required)

    def get_queryset(self):
        # Return an empty queryset since we're not querying for existing users
        return User.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
