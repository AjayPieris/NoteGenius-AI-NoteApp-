# backend/api/urls.py

from django.urls import path, include           # Import path for URLs and include for grouping URLs
from rest_framework.routers import DefaultRouter  # Router auto-generates REST API URLs
from . import views                             # Import your views (signup, login, NoteViewSet)

# Create a router that will automatically create URLs like /notes/, /notes/1/, etc.
router = DefaultRouter()
router.register(r'notes', views.NoteViewSet, basename='note')  
# "notes" = URL name, NoteViewSet = controller for note API

urlpatterns = [
    path('signup/', views.signup),              # /signup/ URL → uses signup function
    path('login/', views.login),                # /login/ URL → uses login function
    path('', include(router.urls)),             # Add all auto-generated note URLs into the app
]
