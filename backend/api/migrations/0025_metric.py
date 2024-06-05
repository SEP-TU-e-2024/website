# Generated by Django 5.0.4 on 2024-05-31 10:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_alter_benchmarkset_id_alter_evaluationsetting_id_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Metric',
            fields=[
                ('code_name', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('display_name', models.CharField(max_length=150)),
                ('unit', models.CharField(choices=[('None', 'None'), ('S', 'Seconds'), ('Min', 'Minutes'), ('H', 'Hours')], max_length=4)),
            ],
        ),
    ]