"""
Database connection for the Creative Cornerstone Flask app.

Reads a single DATABASE_URL environment variable (the format Neon, Render,
Railway, Supabase, etc. all provide), e.g.:
    postgresql://user:password@host/dbname?sslmode=require

For local development you can instead set the individual PG* variables, or
just export DATABASE_URL pointing at a local Postgres.
"""
import os
import psycopg2


def create_connection():
    try:
        url = os.environ.get("DATABASE_URL")
        if url:
            # Neon/Render require SSL; harmless for others.
            sslmode = os.environ.get("PGSSLMODE", "require")
            return psycopg2.connect(url, sslmode=sslmode)

        # Fallback to individual variables (handy for local dev)
        return psycopg2.connect(
            host=os.environ.get("PGHOST", "localhost"),
            port=os.environ.get("PGPORT", "5432"),
            dbname=os.environ.get("PGDATABASE", "creative_cornerstone"),
            user=os.environ.get("PGUSER", "postgres"),
            password=os.environ.get("PGPASSWORD", ""),
        )
    except Exception as e:
        print(f"Database connection error: {e}")
        return None
