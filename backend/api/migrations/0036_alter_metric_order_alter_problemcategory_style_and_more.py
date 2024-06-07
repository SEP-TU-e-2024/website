# Generated by Django 5.0.4 on 2024-06-07 09:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0035_metric_remove_benchmarkrelations_instance_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='metric',
            name='order',
            field=models.IntegerField(choices=[(0, 'Cost'), (1, 'Reward')], default=0),
        ),
        migrations.AlterField(
            model_name='problemcategory',
            name='style',
            field=models.IntegerField(choices=[(0, 'Competition'), (1, 'Scientific')], default=1),
        ),
        migrations.AlterField(
            model_name='problemcategory',
            name='type',
            field=models.IntegerField(choices=[(0, 'Static'), (1, 'Dynamic')], default=0),
        ),
    ]
