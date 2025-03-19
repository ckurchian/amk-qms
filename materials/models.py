from django.db import models

class Material(models.Model):
    MATERIAL_TYPES = [
        ('metal', 'Metal'),
        ('composite', 'Composite'),
        ('polymer', 'Polymer'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=255)
    material_type = models.CharField(max_length=20, choices=MATERIAL_TYPES, default='metal')
    lot_number = models.CharField(max_length=100, unique=True)
    supplier = models.CharField(max_length=255)
    received_date = models.DateField()
    heat_number = models.CharField(max_length=100, blank=True, null=True)
    certification_file = models.FileField(upload_to='certifications/', blank=True, null=True)
    quantity = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=[('available', 'Available'), ('used', 'Used')], default='available')

    def __str__(self):
        return f"{self.name} - Lot {self.lot_number}"

