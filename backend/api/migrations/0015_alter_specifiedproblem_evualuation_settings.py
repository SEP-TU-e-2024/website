# Generated by Django 5.0.4 on 2024-05-17 11:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_alter_problemcategory_simulator_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='specifiedproblem',
            name='evualuation_settings',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.evaluationsetting'),
        ),
    ]
