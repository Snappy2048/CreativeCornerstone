# Creative Cornerstone — modern theme for your Flask app

This folder turns the new modern design into **Jinja templates** that drop into your
existing `Snappy2048/Mywebsite` repo. Your current `app.py`, login, dashboard, and
PostgreSQL database keep working — only the public pages get the new look, and edits
made in your dashboard show up live for everyone.

## What's here

```
flask/
  templates/
    base.html            ← shared layout (nav, footer, theme switch)
    flash_messages.html  ← restyled flash messages
    home/
      index.html
      games.html
      blogs.html
      projects.html
      detailed_blog.html
      products.html       ← NEW public Shop page
  static/
    css/styles.css
    js/main.js
```

## Install (into your repo)

1. **Templates** — copy everything from `flask/templates/` into your repo's
   `templates/` folder, replacing the old `home/*.html`, `base.html` (new), and
   `flash_messages.html`.

2. **Static assets** — copy:
   - `flask/static/css/styles.css` → `static/css/styles.css`
   - `flask/static/js/main.js` → `static/js/main.js`

   Your images already live in `static/uploads/` — no change needed.

3. That's it for the existing pages. Run as usual:
   ```
   python app.py
   ```
   Visit `/`, `/home/games`, `/home/blogs`, `/home/projects` — all themed.

## To enable the public Shop page (one small route)

The Shop link points at `/home/products`. Add this route to `app.py` (it mirrors your
other public routes):

```python
@app.route('/home/products')
def home_products():
    conn = create_connection()
    if not conn:
        return "Database Connection Error. Check console.", 500
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute("SELECT * FROM profile WHERE id = 1")
        profile = cur.fetchone()
        cur.execute("SELECT * FROM products ORDER BY created_at DESC")
        products = cur.fetchall()
    except Exception as e:
        print(f"Error fetching data: {e}")
        profile, products = {}, []
    finally:
        cur.close()
        conn.close()
    return render_template('home/products.html', profile=profile, products=products)
```

Then add `'home_products'` to the `allowed_routes` list inside `require_login`
so the page is public:

```python
allowed_routes = ['login', 'index', 'static', 'images', 'uploads', 'home',
                  'home_games', 'home_projects', 'home_blogs', 'blog_details',
                  'home_products']
```

You already add products through the dashboard (Products section), so once the
route is in, they appear on the Shop page automatically.

## Notes & differences

- **Featured video:** your `profile` table has no video column, so the homepage
  video stays hard-coded in `home/index.html` (same as the original). To make it
  editable, add a `video` column to `profile` and swap the hard-coded URL for
  `{{ profile.video }}`.
- **Theme switcher:** top-right palette + sun/moon buttons let visitors pick a
  color scheme and light/dark; the choice is saved in their browser. Your default
  is dark + the "aurora" palette (set on the `<html>` tag in `base.html`).
- **Template variables used** (must match your DB columns):
  - `profile`: `name`, `about`, `avatar`, `hobbies`
  - `games`: `title`, `description`, `image`, `link`, `embed_code`
  - `blogs`: `id`, `title`, `content`, `thumbnail`, `created_at`, `youtube_link`
  - `projects`: `title`, `description`, `image`, `github_link`
  - `products`: `name`, `description`, `price`, `image`
- **Icons & fonts** load from CDN (Lucide, Google Fonts). No build step, no Tailwind.
- **base.html** sets nav active states from `request.endpoint`, so the right tab
  highlights automatically on every page.

## Admin / dashboard (also restyled)

These replace your existing admin templates and post to the **same routes** you
already have in `app.py` — no backend changes needed.

```
templates/
  admin_base.html   ← sidebar + topbar shell (My Dashboard)
  login.html        ← modern sign-in (POST {{ url_for('login') }})
  dashboard.html    ← overview: stat cards from `counts`, quick links
  games.html        ← add/edit/delete games
  blogs.html        ← "Write a New Blog" form + posts list
  products.html     ← add/edit/delete products
  projects.html     ← add/edit/delete projects
  profile.html      ← update profile + change password
static/
  css/admin.css     ← dashboard styles  (copy to static/css/admin.css)
  js/admin.js       ← edit/delete + sidebar  (copy to static/js/admin.js)
```

Install: copy these into the same `templates/` and `static/` folders as before.

How forms map to your routes (field `name`s match `app.py` exactly):

| Page      | Add route        | Edit route             | Delete route             | Fields (form names) |
|-----------|------------------|------------------------|--------------------------|---------------------|
| Games     | `/add_game`      | `/edit_game/<id>`      | `/delete_game/<id>`      | title, description, link, embed_code, image |
| Blogs     | `/add_blog`      | `/edit_blog/<id>`      | `/delete_blog/<id>`      | title, content, youtube_link, thumbnail |
| Products  | `/add_product`   | `/edit_product/<id>`   | `/delete_product/<id>`   | name, description, price, image |
| Projects  | `/add_project`   | `/edit_project/<id>`   | `/delete_project/<id>`   | title, description, github_link, image |
| Profile   | `/update_profile`| —                      | —                        | username, name, about, skills, hobbies, avatar |
| Password  | `/change_password`| —                     | —                        | current_password, new_password, confirm_password |

Editing: clicking the pencil on a list item fills the form above it and switches
the form's action to the matching `/edit_.../<id>` route (file uploads stay
optional, exactly like your current edit handlers). "Cancel edit" returns the form
to add mode.

Theme switch (light/dark + accent palette) is available in the dashboard topbar too.

