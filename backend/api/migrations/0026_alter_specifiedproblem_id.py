# Generated by Django 5.0.4 on 2024-05-30 11:49

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_merge_20240530_1335'),
    ]

    operations = [
        migrations.AlterField(
            model_name='specifiedproblem',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]