#!/bin/bash

echo "⏳ Waiting for PostgreSQL..."
while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
  sleep 1
done

echo "✅ PostgreSQL is up - continuing..."

echo "⚙️ Running shared migrations..."
python manage.py migrate_schemas --shared

echo "🏢 Creating public tenant (if not exists)..."
python manage.py createpublictenant $PUBLIC_TENANT_URL || true

echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

# Auto create superuser if it doesn't exist
if [ "$CREATE_SUPERUSER" = "true" ]; then
  echo "🛡️  Checking for superuser..."

  # Create superadmin using the updated custom command
  python manage.py createsuperadmin --email="$DJANGO_SUPERUSER_EMAIL" --password="$DJANGO_SUPERUSER_PASSWORD" || true
fi

echo "🚀 Starting Django dev server..."
exec python manage.py runserver 0.0.0.0:${API_CONTAINER_PORT}
