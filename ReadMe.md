# Want to visit the website

## https://ganesh-paudel.github.io/


## Local preview

From the `myweb` folder, run:

```bash
python3 -m http.server 3000
```

Open http://localhost:3000. Use a web server so `projects.json` loads correctly.

## Blog link and deployment

The Writing section links to `blog/index.html`. The complete blog, its images,
and source PDFs are included inside `myweb/blog/`, so upload the **entire myweb
folder's contents** to your static host (or your GitHub Pages repository root).
The portfolio opens the blog in the same tab.

The original blog source remains in `../satellite-blog/dist/`. After editing that
source, copy its contents into `myweb/blog/` to update the embedded copy. To use a
separately hosted blog instead, replace `href="blog/index.html"` on the
`blog-feature` link in `index.html` with its published URL.

Edit portfolio projects in `projects.json`. Colors are defined at the top of
`styles.css`. Animations respect reduced-motion settings and can be paused using
the footer button.
