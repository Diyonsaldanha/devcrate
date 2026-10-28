# Devcrate

A demo storefront for developer-themed keychains and sticker packs, built with Next.js, Tailwind CSS and Stripe Checkout (test mode). No real orders or payments are processed.

## Features

- Product catalog with search, category filter and sorting
- Product detail pages with related items
- Persistent shopping cart (localStorage)
- Stripe Checkout in test mode, with promo codes and a free-shipping threshold
- Server-side price validation in the checkout API

## Tech stack

- Next.js (App Router), React, TypeScript
- Tailwind CSS
- Stripe

## Getting started

```bash
npm install
cp .env.example .env.local   # add your Stripe test key
npm run dev
```

Open http://localhost:3000.

Use Stripe's test card `4242 4242 4242 4242` with any future expiry and CVC.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the project |

## Notes

Brand logos shown on products belong to their respective owners. This is a non-commercial portfolio project.
