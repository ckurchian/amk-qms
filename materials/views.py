from rest_framework import viewsets, permissions
from .models import Material
from .serializers import MaterialSerializer

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    
    # Apply permission rules
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
