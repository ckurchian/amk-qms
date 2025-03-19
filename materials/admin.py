from django.contrib import admin
from .models import Material

@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ('name', 'lot_number', 'supplier', 'received_date', 'status')
    search_fields = ('name', 'lot_number', 'supplier')

