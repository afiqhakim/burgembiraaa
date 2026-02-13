docker run --name postgres-dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=app_db \
  -p 5432:5432 \
  -d postgres:15
