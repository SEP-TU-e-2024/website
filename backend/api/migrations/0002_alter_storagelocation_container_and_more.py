# Generated by Django 5.0.4 on 2024-06-28 12:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='storagelocation',
            name='container',
            field=models.CharField(default='', max_length=256),
        ),
        migrations.AlterField(
            model_name='storagelocation',
            name='filepath',
            field=models.CharField(default='', max_length=256),
        ),
    ]
