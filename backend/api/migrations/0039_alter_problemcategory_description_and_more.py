# Generated by Django 5.0.4 on 2024-06-07 11:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0038_alter_specifiedproblem_metrics'),
    ]

    operations = [
        migrations.AlterField(
            model_name='problemcategory',
            name='description',
            field=models.CharField(max_length=2048),
        ),
        migrations.AlterField(
            model_name='submission',
            name='name',
            field=models.CharField(max_length=256, unique=True),
        ),
    ]
