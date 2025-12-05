# backend/api/views.py

from django.shortcuts import render           
from rest_framework.decorators import api_view, permission_classes # <--- Import permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny # <--- Import AllowAny# (Not used here) Used for rendering HTML pages
from django.contrib.auth.models import User              # Django's built-in User model
from rest_framework import status                        # Helps send status codes like 200, 400, 404
from rest_framework.decorators import api_view           # Turns a function into an API endpoint
from rest_framework.response import Response             # Used to return JSON data
from rest_framework.authtoken.models import Token        # Creates login tokens for users
from django.contrib.auth import authenticate             # Checks username + password for login
from .serializers import UserSerializer 
from rest_framework import viewsets, permissions
from .models import Note
from .serializers import NoteSerializer
from .ai_service import generate_note_extras # <--- Import our AI helper# Converts User data to/from JSON


# ---------------- SIGNUP API ----------------
@api_view(['POST'])   
@permission_classes([AllowAny])# Only allow POST requests
def signup(request):
    
    serializer = UserSerializer(data=request.data)       # Put JSON data into the serializer

    if serializer.is_valid():                            # Check if data is valid
        user = serializer.save()                         # Create the user safely (password hashed)

        token = Token.objects.create(user=user)          # Create a new token for this user

        return Response({                                # Send token + user info to frontend
            "token": token.key,
            "user": serializer.data
        })

    return Response(                                     # If invalid data → send errors
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# ---------------- LOGIN API ----------------
@api_view(['POST'])  
@permission_classes([AllowAny])# Only allow POST requests
def login(request):
    username = request.data.get('username')              # Get username from request JSON
    password = request.data.get('password')              # Get password from request JSON

    user = authenticate(username=username, password=password)   # Check username + password

    if user is not None:                                 # If login is correct
        token, created = Token.objects.get_or_create(user=user) # Get existing token OR create new

        serializer = UserSerializer(user)                # Convert user to JSON

        return Response({                                # Send token + user info
            "token": token.key,
            "user": serializer.data
        })

    else:
        return Response(                                 # Wrong username or password
            {"error": "Invalid Credentials"},
            status=status.HTTP_404_NOT_FOUND
        )


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer          # Use NoteSerializer to convert data to/from JSON
    permission_classes = [permissions.IsAuthenticated]  # Only logged-in users can use this API

    def get_queryset(self):
        # Return only the notes that belong to the currently logged-in user.
        # This prevents users from seeing each other's notes.
        return Note.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Step 1: Take the raw content text the user typed.
        content = serializer.validated_data.get('content')

        # Step 2: Send the content to AI to generate title, summary, and tags.
        ai_data = generate_note_extras(content)

        # Step 3: Save the new note in the database.
        # Attach the note to the logged-in user and add the AI-generated fields.
        serializer.save(
            user=self.request.user,                # Which user the note belongs to
            ai_title=ai_data['ai_title'],          # AI-generated title
            ai_summary=ai_data['ai_summary'],      # AI-generated summary
            ai_tags=ai_data['ai_tags']             # AI-generated tags
        )

        
        