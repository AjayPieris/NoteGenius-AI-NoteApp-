# backend/api/serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # These are the fields we want to send/receive in JSON
        fields = ["id", "username", "password"]

        # "write_only=True" → you can SEND a password,
        # but it will never be SHOWN back in the API response.
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # When creating a user, we use "create_user"
        # because it automatically ENCRYPTS the password.
        # (So plain text password is never stored in the database)
        user = User.objects.create_user(**validated_data)
        return user

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = [
            "id",
            "content",
            "ai_title",
            "ai_summary",
            "ai_tags",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["ai_title", "ai_summary", "ai_tags", "created_at", "updated_at"]