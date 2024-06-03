# Generated by Django 5.0.4 on 2024-06-03 09:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_metric'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='result',
            name='metric',
        ),
        migrations.RemoveField(
            model_name='specifiedproblem',
            name='metrics',
        ),
        migrations.AddField(
            model_name='result',
            name='metric',
            field=models.ManyToManyField(to='api.metric'),
        ),
        migrations.AddField(
            model_name='specifiedproblem',
            name='metrics',
            field=models.ManyToManyField(to='api.metric'),
        ),
    ]
