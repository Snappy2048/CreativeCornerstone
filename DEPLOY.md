# Deploy the Creative Cornerstone for free

This gets your Flask site live on the internet, with a working dashboard and a
real database, at **$0/month**, using:

- **Neon** — free PostgreSQL database (stays free; doesn't expire)
- **Render** — free web hosting for the Flask app
- **GitHub** — to hold your code (Render deploys from it)

You'll do the account/click steps (I can't log in as you); everything else —
the code, database setup, and config — is already prepared in this `flask/` folder.

Total time: about 20-30 minutes.

---

## What's already prepared for you

```
flask/
  templates/        modern Jinja templates (public pages + dashboard)
  static/css, js    styles + scripts
  connection.py     reads DATABASE_URL (works with Neon/Render)
  schema.sql        the database tables
  init_db.py        creates tables + an admin login + starter content
  requirements.txt  Python packages
  Procfile          start command (gunicorn app:app)
  runtime.txt       Python version
```

You also need your existing **`app.py`** (and any other files from your repo).
Before deploying, make these small edits to `app.py` — see
`README_FLASK.md` for the exact snippets:

1. Add the `/home/products` route (for the Shop page).
2. Add `'home_products'` to the `allowed_routes` list in `require_login`.
3. **Recommended:** change the secret key so logins survive restarts. Replace
   ```python
   secret_key = os.urandom(24)
   app.secret_key = secret_key
   ```
   with
   ```python
   app.secret_key = os.environ.get("SECRET_KEY", os.urandom(24).hex())
   ```
   and you'll set `SECRET_KEY` in Render below.

Also replace your old `connection.py` with the one in this folder (it reads the
`DATABASE_URL` that hosts provide).

---

## Step 1 — Put the code on GitHub

You already have a repo (`Snappy2048/Mywebsite`). Easiest path:

1. Copy the prepared files into your repo so the layout is:
   ```
   app.py
   connection.py            <- from this folder
   requirements.txt         <- from this folder
   Procfile                 <- from this folder
   runtime.txt              <- from this folder
   schema.sql               <- from this folder
   init_db.py               <- from this folder
   templates/               <- replace with this folder's templates/
   static/                  <- add this folder's static/ (css, js)
   ```
2. Commit and push to GitHub. (On github.com you can also use **Add file → Upload
   files** and drag them in if you don't use git.)

---

## Step 2 — Create the free database (Neon)

1. Go to **https://neon.tech** and sign up (free; you can use "Sign in with GitHub").
2. Create a new **Project** (any name, e.g. `creative-cornerstone`).
3. On the project dashboard, find the **Connection string** and copy it. It looks like:
   ```
   postgresql://USER:PASSWORD@ep-xxxx.aws.neon.tech/dbname?sslmode=require
   ```
   Keep this handy — it's your `DATABASE_URL`.

---

## Step 3 — Create the web service (Render)

1. Go to **https://render.com** and sign up (free; "Sign in with GitHub" is simplest).
2. Click **New → Web Service**, then connect and pick your `Mywebsite` repo.
3. Fill in:
   - **Runtime:** Python
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Instance Type:** Free
4. Under **Environment Variables**, add:
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | the Neon connection string from Step 2 |
   | `SECRET_KEY` | any long random text (e.g. mash the keyboard) |
   | `ADMIN_USERNAME` | the username you want (e.g. `aaditya`) |
   | `ADMIN_PASSWORD` | a password you'll remember |
5. Click **Create Web Service** and wait for the first deploy to finish.

---

## Step 4 — Set up the database tables (run once)

The database is empty until you create the tables. On your Render service:

1. Open the **Shell** tab (free instances include a shell).
2. Run:
   ```
   python init_db.py
   ```
   You should see "Done. Admin user: ...". This creates the tables, your admin
   login, your profile, and a few starter games/blog posts/projects.

(If the Shell isn't available, you can instead set the **Build Command** to
`pip install -r requirements.txt && python init_db.py` for the first deploy,
then change it back to just the pip line.)

---

## Step 5 — You're live

1. Render gives you a URL like `https://creative-cornerstone.onrender.com`.
2. Visit it — your modern site should load with the starter content.
3. Go to `/login`, sign in with the `ADMIN_USERNAME` / `ADMIN_PASSWORD` you set,
   and you're in the dashboard. Change your password under **Profile** anytime.
4. Add/edit blogs, games, projects, and products — they save to the database and
   show up live for every visitor.

### Optional: custom domain
In Render → your service → **Settings → Custom Domains**, add a domain you own
and follow the DNS instructions. (A `.onrender.com` URL is free and fine to start.)

---

## Good to know (free-tier quirks)

- **First visit after idle is slow.** Render's free web service "sleeps" after
  ~15 min of no traffic and takes ~30-60 seconds to wake on the next visit. Normal
  for free hosting; upgrade later to keep it always-on.
- **Uploaded image files don't persist.** Render's free disk resets on each deploy,
  so images you upload through the dashboard can disappear after a redeploy. Two easy
  workarounds: paste an image **URL** instead of uploading a file (the pages accept
  full `http...` links), or add object storage later. Text content (blogs, etc.) is
  safe — it's in the Neon database, which persists.
- **Keep your secrets secret.** Never commit `DATABASE_URL`, `SECRET_KEY`, or
  passwords into GitHub — set them only as environment variables in Render.
