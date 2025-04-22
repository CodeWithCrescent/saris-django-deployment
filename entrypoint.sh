#!/bin/bash

echo "⏳ Waiting for PostgreSQL..."
while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
  sleep 1
done

echo "✅ PostgreSQL is up - continuing..."

echo "⚙️ Running shared migrations..."
python manage.py migrate_schemas --shared

echo "🏢 Creating public tenant (if not exists)..."
python manage.py createpublictenant sarisdemo.saris.info.tz || true

echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

# Auto create superadmin using custom command
if [ "$CREATE_SUPERUSER" = "true" ]; then
  echo "🛡️  Checking for superuser..."
  python manage.py shell << END
from uaa.models import User
if not User.objects.filter(email="${DJANGO_SUPERUSER_EMAIL}").exists():
    print("🔑 Creating superadmin ${DJANGO_SUPERUSER_EMAIL}...")
    import subprocess
    subprocess.run([
        "python", "manage.py", "createsuperadmin"
    ], input=f"{DJANGO_SUPERUSER_EMAIL}\n${DJANGO_SUPERUSER_PASSWORD}\n${DJANGO_SUPERUSER_PASSWORD}\n", text=True)
else:
    print("✅ Superuser already exists: ${DJANGO_SUPERUSER_EMAIL}")
END
fi

echo "🚀 Starting Django dev server..."
exec python manage.py runserver 0.0.0.0:${API_CONTAINER_PORT}
