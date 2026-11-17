# Order sheet + admin page - setup

How it fits together:

```
Customer taps "Confirm on WhatsApp"
   |-- WhatsApp opens (as before)
   '-- website quietly sends the order to  /api/orders
                                              |
                                  Google Apps Script (this folder's Code.gs)
                                              |
                                  one new row in your Google Sheet

You open  /admin  -> sign in -> counts, sales and latest orders
```

The site only ever makes **one small request per order** and **one per admin page
view** (when you open it or press Refresh). Nothing polls, so there is no
ongoing load on the Cloudflare Worker.

## One-time setup (about 10 minutes)

### 1. Make the sheet
1. Go to https://sheets.google.com and create a blank sheet named **Hafiz Nuts Orders**.
2. Keep it private (do not share the link) - it will hold customer names, phones and addresses.

### 2. Add the script
1. In the sheet: **Extensions -> Apps Script**.
2. Delete everything in the editor and paste the full contents of [`Code.gs`](Code.gs).
3. On the line `var SECRET = "PASTE_THE_SECRET_HERE";` replace the text in quotes with the
   `ORDERS_SECRET` value you were given (keep the quotes).
4. Click the disk icon to save.

### 3. Publish it as a web app
1. Click **Deploy -> New deployment**, click the gear, choose **Web app**.
2. **Execute as:** Me. **Who has access:** Anyone.
3. Click **Deploy**, approve the permissions (Google may warn the app is
   unverified: **Advanced -> Go to ... (unsafe)** - it is your own script).
4. Copy the **Web app URL** (it ends in `/exec`).

"Anyone" only means anyone *who also knows the secret* can use it - requests
without the secret are rejected.

### 4. Give the website the URL
Run in the project folder (it asks you to paste the value each time):

```bash
npx wrangler secret put ORDERS_SCRIPT_URL   # paste the Web app URL
```

`ORDERS_SECRET` and `ADMIN_PASSWORD` are already set. Then open the live
site's `/admin`, sign in, and place a test order to see it appear.

## Daily use
- New orders appear as rows in the sheet and in **/admin -> Latest orders**.
- Change an order's **Status** (New, Confirmed, Shipped, Delivered, Cancelled)
  using the dropdown in the sheet, then press **Refresh** in /admin.
- Cancelled orders are left out of the sales totals.

## If you change the script
After editing `Code.gs` in Google, use **Deploy -> Manage deployments -> Edit ->
New version -> Deploy**. The URL stays the same.

## Changing secrets
```bash
npx wrangler secret put ADMIN_PASSWORD   # new admin password (signs everyone out)
npx wrangler secret put ORDERS_SECRET    # also update SECRET in the script
```
