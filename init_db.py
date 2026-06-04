"""
One-time database setup for the Creative Cornerstone app.

Creates the tables and seeds them with starter content + an admin login.
Safe to run more than once: it won't duplicate rows that already exist.

Usage (locally or in your host's shell):
    ADMIN_USERNAME=admin ADMIN_PASSWORD=changeme python init_db.py
"""
import os
from connection import create_connection
from werkzeug.security import generate_password_hash

ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin")

ABOUT = ("My name is Aaditya! I'm a 13-year-old who loves exploring different hobbies. "
         "Coding is one of my favorite activities because I enjoy solving problems and building "
         "fun projects. I'm also passionate about piano, guitar, and karate, which keep me active "
         "and teach me discipline. STEM is another big interest of mine - I love learning how things "
         "work. I'm fascinated by cars, enjoy creating with Legos, and have fun folding intricate "
         "origami designs. Reading is a great way for me to explore new ideas, and I enjoy spending "
         "time with friends, whether playing video games or just having fun together!")

GAMES = [
    ("Soccer Animation", "One of my first Scratch projects. Press space to start and the Green Flag to reset."),
    ("Space Platformer", "Navigate levels, jump over obstacles, avoid enemies, and collect crystals to reach the end. Aim for the highest score!"),
    ("Pokemon Escape V2", "Press the spacebar to jump. Avoid touching the black line, and get a surprise when you reach 5000 points. Peace!"),
]

PROJECTS = [
    ("Chess V1", "This is my first version of chess that I made - a hands-on project for learning game logic, rules, and board state.",
     "https://brightkid.futuremug.com/static/uploads/wooden-chess-pawn-Ka8xY62-600.jpg", "https://github.com/Snappy2048/ChessV1"),
]

BLOGS = [
    ("Aaditya's Achievements of 2025", "Got back into Adv Science and Adv Math, drove the BMW, flew a plane, went to Cancun again, restarted piano, started electric guitar and percussion, lost 20lbs, expanded the Creative Cornerstone, and learnt to deploy code to the internet."),
    ("My Video Journey - Intro", "My book summaries started in fifth grade. I learned to use CapCut and clip videos together. The first book I summarized was The Monk Who Sold His Ferrari, then Seven Habits of Highly Effective Teens, then Who Moved My Cheese."),
    ("Summary of The Monk Who Sold His Ferrari", "My takeaways from Robin Sharma's The Monk Who Sold His Ferrari."),
]


def main():
    conn = create_connection()
    if not conn:
        raise SystemExit("Could not connect to the database. Is DATABASE_URL set?")
    cur = conn.cursor()

    # 1) Schema
    here = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(here, "schema.sql"), "r", encoding="utf-8") as f:
        cur.execute(f.read())

    # 2) Admin login
    cur.execute("SELECT id FROM login WHERE username = %s", (ADMIN_USERNAME,))
    row = cur.fetchone()
    if row:
        login_id = row[0]
    else:
        cur.execute(
            "INSERT INTO login (username, password_hash) VALUES (%s, %s) RETURNING id",
            (ADMIN_USERNAME, generate_password_hash(ADMIN_PASSWORD)),
        )
        login_id = cur.fetchone()[0]

    # 3) Profile (id = 1)
    cur.execute("SELECT id FROM profile WHERE id = 1")
    if not cur.fetchone():
        cur.execute(
            "INSERT INTO profile (id, login_id, name, about, avatar, skills, hobbies) "
            "VALUES (1, %s, %s, %s, %s, %s, %s)",
            (login_id, "Aaditya", ABOUT,
             "https://brightkid.futuremug.com/static/uploads/u1_white.jpg",
             "Python, Scratch", "Gaming, Coding"),
        )

    # 4) Seed content only if the tables are empty
    cur.execute("SELECT COUNT(*) FROM games")
    if cur.fetchone()[0] == 0:
        for t, d in GAMES:
            cur.execute("INSERT INTO games (title, description) VALUES (%s, %s)", (t, d))

    cur.execute("SELECT COUNT(*) FROM projects")
    if cur.fetchone()[0] == 0:
        for t, d, img, gh in PROJECTS:
            cur.execute("INSERT INTO projects (title, description, image, github_link) VALUES (%s, %s, %s, %s)", (t, d, img, gh))

    cur.execute("SELECT COUNT(*) FROM blogs")
    if cur.fetchone()[0] == 0:
        for t, c in BLOGS:
            cur.execute("INSERT INTO blogs (title, content) VALUES (%s, %s)", (t, c))

    conn.commit()
    cur.close()
    conn.close()
    print(f"Done. Admin user: '{ADMIN_USERNAME}'. Log in and change the password under Profile.")


if __name__ == "__main__":
    main()
