# Risa Pieters — personal website

Dependency-free HTML, CSS, and JavaScript. Run `python3 -m http.server 3000` from this directory to preview.

73 fine concentric rings, each representing one year, sit with the name and poem in a stationary left column. The right column contains the photo and compact professional lists. The two-column layout scales with viewport width and height to fit on one page without scrolling. The first 32 rings are complete as of October 27, 2026. The current ring fills automatically using April 11, 1994 and the current date in America/New_York. Each birthday-to-birthday year is divided into 52 equal slices to account for the extra day or two beyond 52 seven-day weeks. The current ring fills clockwise from the top as one continuous arc, advancing by 1/52 of its circumference for each completed increment. Past rings are equally dark; there is no five-year grouping. Progress rechecks every minute while open and immediately on returning to the tab or restoring the page; it redraws only when the New York calendar date changes, preserving selected rings and keyboard focus. Future rings fade outward. Hover, tap, or use arrow keys to explore rings. The diagram is 82.5% of the poem’s width (about 185px at full scale) and shrinks with the page. Thin, evenly spaced black SVG outlines draw all 73 years; future years fade progressively through lower opacity. Hover targets meet halfway between adjacent circles; each year also remains keyboard accessible.

The portrait, work history, and affiliations are supplied by Risa. Full poem supplied by the user with attribution.

## Publishing

Repository: https://github.com/rpiettt/rpiettt.github.io

Public site: https://rpiettt.github.io/

GitHub Pages serves the repository root on the `main` branch. `.nojekyll` keeps this a plain static site with no build step. Push updates to `main` to publish them. The custom domain `risapieters.com` is not configured yet.

Only the site source and its current portrait are published. Local experiments in `work/` and the unused original portrait are ignored.
