# api/models.py
from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    # 1. Relationship: Link this note to a specific User. 
    # 'on_delete=models.CASCADE' means if we delete the User, delete their notes too.
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    # 2. User Input: The raw content the user types.
    content = models.TextField()

    # 3. AI Generated Fields: We leave these blank initially.
    # The AI will fill these in after the user saves.
    ai_title = models.CharField(max_length=200, blank=True, null=True)
    ai_summary = models.TextField(blank=True, null=True)
    ai_tags = models.CharField(max_length=200, blank=True, null=True)

    # 4. Timestamps: Good practice for ordering data.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.ai_title or "Untitled Note"