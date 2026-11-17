# Hafiz Nuts - Project Overview (plain English)

A one-page picture of what you have, how it works, and what you do with it.
No coding knowledge needed.

---

## 1. The big picture

You have **one website** and **one Google Sheet**. That's it.

```
   CUSTOMER                       YOUR WEBSITE                      YOU
 (phone / laptop)            (hosted on Cloudflare)

 browses products  ───────►  Home, Products, Checkout
 fills checkout form ─────►  opens WhatsApp with the order   ───►  you reply on WhatsApp
                      └────►  also saves the order  ──────────►  Google Sheet (your record)
                                                                     │
                                          /admin page  ◄─────────────┘
                                   (counts, tabs, change status)  ◄── you, with a password
```

- **WhatsApp is still the order.** The sheet is just your safe record of it.
- **There is no database and no shop software to maintain.** That's why it's fast and almost free.

---

## 2. What customers see

| Page | What it is |
|---|---|
| **Home** | Hero, 4 featured products (2 x 2 on phones), bundle offers, health benefits, why choose us, customer reviews (swipeable), contact |
| **Products** | The full range |
| **Product pages** | One page per product |
| **Checkout** | Name, phone, address, city, payment (Cash on Delivery or EasyPaisa). Delivery fee Rs 300. Opens WhatsApp |
| **Info pages** | Product info, Privacy, Terms, Cookies, Shipping & Returns |

Tracking is built in: **TikTok Pixel** and **Google Tag Manager**.

---

## 3. What happens to an order

1. Customer presses **Confirm Order on WhatsApp**.
2. WhatsApp opens with the order already typed. The customer presses **Send**.
3. At the same moment the site quietly saves a row in your **Google Sheet** (status **New**).
4. You confirm with the customer on WhatsApp.
5. You open **/admin** and set the order's status: **New → Confirmed → Shipped → Delivered** (or **Cancelled**).

If Google is slow, the customer is not affected. WhatsApp still opens.

---

## 4. Your admin page (`/admin`)

- Sign in with the admin password.
- **Top tiles:** Total, Today, Last 7 days, This month.
- **Sales:** this month and all time (cancelled orders are not counted).
- **Confirmation progress:** how many are *waiting to confirm* and how many are *confirmed*.
- **Tabs:** All / New / Confirmed / Shipped / Delivered / Cancelled, each with a count. Each tab shows the latest 5 orders.
- **Status dropdown** on every order to change it.
- Press **Refresh** to see new orders. It never updates by itself, which keeps the site light.

---

## 5. Where everything lives

| Thing | Where | Notes |
|---|---|---|
| Live website | https://hafiz-nuts.hafiznuts435.workers.dev | Hosted on **Cloudflare** |
| Website code | Your computer (`E:\Hafiz Nuts`) and **GitHub** | GitHub copy is behind: push is pending |
| Orders | **Google Sheet** "Hafiz Nuts Orders" | Keep it private |
| Sheet connector | **Google Apps Script** (inside the sheet) | Code is in `google-sheet/Code.gs` |
| Passwords and secrets | Cloudflare secrets + your local `.env` file | `.env` is never uploaded to GitHub |

### The three secrets

| Name | What it does |
|---|---|
| `ADMIN_PASSWORD` | Lets you into `/admin` |
| `ORDERS_SECRET` | The shared key between the website and the Google script (must match the `SECRET` line in the script) |
| `ORDERS_SCRIPT_URL` | The link to your Google script |

Forgot one? Set a new one:
`npx wrangler secret put ADMIN_PASSWORD` (same for the others).

---

## 6. The few things you actually do

| When | Task |
|---|---|
| Every day | Open `/admin`, press Refresh, confirm new orders on WhatsApp, update statuses |
| New review | Send it to me (or add it to the reviews list in `components/TestimonialsSection.tsx`) |
| Price/product change | Ask me. It's a small code edit, then a redeploy |
| Publish a change | `npm run deploy` in the project folder |
| Back up to GitHub | `git push origin master` |
| Monthly | `npm audit --omit=dev`, upgrade Next.js if flagged |

---

## 7. Security in one paragraph

The site has protective headers, admin logins that expire after 12 hours, and
checks so only your own website can send orders. No secret is stored in GitHub.
What's left is on your side: **two-step verification** on Cloudflare, Google,
GitHub and your domain; **Cloudflare Access** in front of `/admin`; and
**rate limits** on login and orders. (We're doing these one step at a time.)

---

## 8. What's left to do

- [ ] Two-step verification on all four accounts (Step 1 of 5)
- [ ] Cloudflare Access for `/admin`
- [ ] Cloudflare rate-limit rules (login and orders)
- [ ] Keep the Google Sheet and script link private
- [ ] Push the latest code to GitHub
- [ ] Check that TikTok and Tag Manager events fire on the live site
- [ ] Add customer photos for the reviews (currently initials)
- [ ] Add a line to the Privacy page that orders are recorded in a sheet

---

## 9. If you want it simpler later

This setup is deliberately small. Two ways it could grow:

- **More products and staff:** move to WooCommerce/WordPress (a bigger, slower,
  higher-maintenance system, but with a built-in admin for everything).
- **Same site, more tools:** keep this, and add order-notification messages or an
  edit-products page.

For now, **one website + one sheet + one admin page** is all you need to run.
