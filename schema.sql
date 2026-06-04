-- Creative Cornerstone — database schema
-- Run once against a fresh PostgreSQL database (init_db.py does this for you).

CREATE TABLE IF NOT EXISTS login (
    id            SERIAL PRIMARY KEY,
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS profile (
    id       SERIAL PRIMARY KEY,
    login_id INTEGER REFERENCES login(id),
    name     TEXT,
    about    TEXT,
    avatar   TEXT,
    skills   TEXT,
    hobbies  TEXT
);

CREATE TABLE IF NOT EXISTS games (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    image       TEXT,
    link        TEXT,
    embed_code  TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blogs (
    id           SERIAL PRIMARY KEY,
    title        TEXT,
    content      TEXT,
    thumbnail    TEXT,
    youtube_link TEXT,
    created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    image       TEXT,
    github_link TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT,
    price       NUMERIC,
    image       TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);
