# For Sanvi ♡

A personal Princess Day surprise, built with HTML, CSS, and JavaScript.

## Run locally

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

Open http://localhost:8000. Edit `dist/index.html`, `dist/style.css`, and `dist/app.js` directly. The live images are in `dist/assets/`.

## Deploy with GitHub Pages

The `main` branch contains the editable project. The `gh-pages` branch contains only the ready-to-publish contents of `dist`.

1. Open https://github.com/pranavgupta701/sanvi/settings/pages.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Select **gh-pages**, select **/ (root)**, and click **Save**.
4. Under **Custom domain**, enter `sanvi.neuralagent.dev` and **Save** (or confirm it is already set).
5. Follow the DNS instructions below. GitHub will deploy the publishing branch; progress appears in the repository's **Actions** tab.

## Connect sanvi.neuralagent.dev

The domain's public nameservers currently point to Namecheap. In Namecheap, open **Domain List → neuralagent.dev → Manage → Advanced DNS → Host Records → Add New Record**:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| CNAME Record | sanvi | pranavgupta701.github.io | Automatic |

Enter the target without `https://` or `/sanvi`. Leave the root domain and other subdomains unchanged. Replace any conflicting record for `sanvi` itself.

After saving, wait for GitHub Pages' DNS check and certificate provisioning, then enable **Enforce HTTPS** in Pages settings. DNS and certificate availability can take up to 24 hours.

The final address is https://sanvi.neuralagent.dev.

`dist/CNAME` preserves the custom domain on the publishing branch, and `dist/.nojekyll` serves the static files directly.

Official documentation:
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Publish future changes

From this project folder, after editing and checking the website:

```sh
git add dist
git commit -m "Update Sanvi's surprise"
git push origin main
git subtree push --prefix dist origin gh-pages
```

The final command updates the publishing branch and triggers GitHub Pages. Pushing only `main` does not update the live site. No build or dependency installation is needed.
