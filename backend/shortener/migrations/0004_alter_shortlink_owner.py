from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("shortener", "0003_shortlink_short_url_alter_shortlink_slug"),
    ]

    operations = [
        migrations.AlterField(
            model_name="shortlink",
            name="owner",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=models.SET_NULL,
                related_name="links",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]