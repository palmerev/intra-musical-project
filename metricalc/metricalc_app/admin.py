from django.contrib import admin
from .models import Composer
from .models import Piece
from .models import MeterGroup
# Register your models here.

admin.site.register(Composer)
admin.site.register(Piece)
admin.site.register(MeterGroup)
