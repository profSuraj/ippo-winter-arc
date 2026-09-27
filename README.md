# IPPO × Winter Arc — Mobile PWA

## What this is
A 30-day IPPO bodyweight + running + Instagram creator tracker.

## Deploy
Upload ALL files in this folder to any HTTPS static host. The app must be served over HTTPS (localhost is also allowed for development).

Easy options:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

After opening the HTTPS URL on your phone, use the browser menu → Add to Home Screen / Install App.

## Files
- index.html — app
- manifest.webmanifest — install metadata
- sw.js — offline caching
- icon-192.png / icon-512.png — app icons

Progress is stored locally in the browser using localStorage.
