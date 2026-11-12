# GST RATE FINDER

A simple static website to look up the GST rate of a product (works on mobile and desktop).

## Deploy on GitHub Pages
1. Create a new GitHub repository.
2. Upload ALL files from this folder (including `.nojekyll`).
3. Go to Settings -> Pages -> Source: "Deploy from a branch" -> branch `main`, folder `/ (root)`.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Adding or updating products
1. Open `products.csv` in Excel / Google Sheets.
2. For each product, check the rate on the official CBIC page
   (https://cbic-gst.gov.in/hindi/gst-goods-services-rates.html) and the HSN code on the
   GST portal (https://services.gst.gov.in/services/searchhsnsac).
3. Fill the columns. Set `verified` to `yes` ONLY after you have confirmed the details,
   and fill `last_verified` (e.g. 2026-11-13). Rows marked `no` show
   "Could not be verified" instead of a rate.
4. Run `python build_data.py` to regenerate `data.js`, then commit and push.

Columns: name, aliases (separate with ;), category, applicable (Applicable / Not Applicable),
gst_rate (number, e.g. 18), hsn, source_label, source_url, notification, last_verified, verified.

CGST and SGST are shown as half of the GST rate and IGST equals the GST rate.
