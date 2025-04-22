#!/bin/bash

echo "⏳ Waiting for PostgreSQL..."
while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
  sleep 1
done

echo "✅ PostgreSQL is up - continuing..."

echo "⚙️ Running shared migrations..."
python manage.py migrate_schemas --shared

echo "🏢 Creating public tenant (if not exists)..."
# python manage.py createpublictenant localhost || true
python manage.py createpublictenant py.saris.info.tz || true

echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

echo "🚀 Starting Django dev server..."
exec python manage.py runserver 0.0.0.0:${API_CONTAINER_PORT}


# Auto create superuser if it doesn't exist
if [ "$CREATE_SUPERUSER" = "true" ]; then
  echo "🛡️  Checking for superuser..."
  python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email="${DJANGO_SUPERUSER_EMAIL}").exists():
    print("🔑 Creating superuser ${DJANGO_SUPERUSER_EMAIL}...")
    User.objects.create_superuser(
        email="${DJANGO_SUPERUSER_EMAIL}",
        password="${DJANGO_SUPERUSER_PASSWORD}"
    )
else:
    print("✅ Superuser already exists: ${DJANGO_SUPERUSER_EMAIL}")
END
fi
