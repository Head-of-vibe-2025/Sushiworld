# Webflow CMS Field Structure

This document describes the expected field structure for your Webflow collections.

## Menu Items Collection

Create a collection in Webflow called "Menu Items" (or similar) with these fields:

### Required Fields

| Field Name | Field Type | Description | Example |
|------------|------------|-------------|---------|
| `name` | Plain Text | Name of the menu item | "Salmon Nigiri" |
| `slug` | Plain Text | URL-friendly identifier (auto-generated) | "salmon-nigiri" |
| `price` | Number | Price in euros | 4.50 |

### Optional Fields

| Field Name | Field Type | Description | Example |
|------------|------------|-------------|---------|
| `description` | Plain Text or Rich Text | Description of the item | "Fresh salmon on sushi rice" |
| `main-image` | Image | Photo of the item | (Upload image) |
| `category` | Plain Text or Reference | Category identifier | "Nigiri" |
| `region` | Option | Where item is available | Options: "BE", "LU", "BOTH" |
| `is-available` | Switch | Whether item is currently available | true/false |

### Field Details

#### `name` (Required)
- Type: Plain Text
- Max length: 100 characters
- This will be displayed as the item title in the app

#### `slug` (Required)
- Type: Plain Text
- Auto-generate from name
- Used as the item code in the cart

#### `price` (Required)
- Type: Number
- Format: Decimal (e.g., 4.50)
- Unit: Euros (€)
- Min: 0

#### `description` (Optional)
- Type: Plain Text (recommended) or Rich Text
- Max length: 500 characters
- Displayed under the item name
- Keep it concise for mobile display

#### `main-image` (Optional)
- Type: Image
- Recommended size: 800x800px
- Format: JPG or PNG
- Aspect ratio: Square (1:1) or landscape (16:9)
- Max file size: 2MB

#### `category` (Optional)
- Type: Plain Text or Reference to Categories collection
- Examples: "Nigiri", "Sashimi", "Rolls", "Appetizers", "Desserts"
- Used for filtering in the app

#### `region` (Optional)
- Type: Option (dropdown)
- Options:
  - `BE` - Available only in Belgium
  - `LU` - Available only in Luxembourg
  - `BOTH` - Available in both regions
- Default: `BOTH` (if not specified, item shows in all regions)

#### `is-available` (Optional)
- Type: Switch (boolean)
- Default: `true`
- Set to `false` to temporarily hide items without deleting them
- Useful for seasonal items or out-of-stock products

## Categories Collection (Optional)

If you want to manage categories separately, create a "Categories" collection:

| Field Name | Field Type | Description | Example |
|------------|------------|-------------|---------|
| `name` | Plain Text | Category name | "Nigiri" |
| `slug` | Plain Text | URL-friendly identifier | "nigiri" |
| `description` | Plain Text | Category description | "Traditional hand-pressed sushi" |
| `main-image` or `image` | Image | Category image for grid display | (Upload image) |

**Note:** Category images are displayed in the app's menu grid view. Recommended size: 800x800px, square format.

Then in your Menu Items collection, change the `category` field to a Reference field pointing to this collection.

## Example Item in Webflow

```
Name: Salmon Nigiri
Slug: salmon-nigiri (auto-generated)
Price: 4.50
Description: Fresh Norwegian salmon on hand-pressed sushi rice
Main Image: [uploaded image of salmon nigiri]
Category: Nigiri
Region: BOTH
Is Available: ✓ (checked)
```

## Tips for Content Management

### Images
- Use consistent image sizes for a professional look
- Take photos with good lighting
- Use a clean, simple background
- Show the actual portion size

### Descriptions
- Keep descriptions short and appetizing
- Mention key ingredients
- Note any allergens if needed
- Use consistent tone and style

### Pricing
- Use consistent decimal places (e.g., 4.50 not 4.5)
- Update prices in Webflow - they sync automatically
- Consider using Webflow's multi-currency if needed

### Categories
- Use consistent category names
- Don't create too many categories (5-10 is ideal)
- Consider the order customers browse

### Availability
- Use `is-available` instead of deleting items
- This preserves item history and makes re-enabling easier
- Good for seasonal items or temporary stock issues

## Syncing to App

Changes in Webflow are reflected in the app:
- **Immediately** for new requests (cached for 5 minutes)
- **Automatically** - no manual sync needed
- **Securely** - API token stays server-side

To force a refresh in the app:
1. Pull down on the menu screen (pull-to-refresh)
2. Or close and reopen the app

## Testing Your Setup

After setting up your collections:

1. Add a few test items in Webflow
2. Publish your site
3. Test the API endpoint:
   ```bash
   curl "https://YOUR_PROJECT.supabase.co/functions/v1/webflow-menu?region=BE" \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```
4. Check that items appear in the app

## Troubleshooting

### Items not showing in app
- ✓ Check `is-available` is true
- ✓ Check `region` matches (BE, LU, or BOTH)
- ✓ Verify price is set
- ✓ Ensure site is published in Webflow

### Images not loading
- ✓ Check image is uploaded in Webflow
- ✓ Verify image URL is accessible
- ✓ Try re-uploading the image

### Wrong data showing
- ✓ Wait 5 minutes for cache to expire
- ✓ Or pull-to-refresh in the app
- ✓ Check you're editing the right collection

---

**Need help?** Check the [WEBFLOW_SETUP.md](./WEBFLOW_SETUP.md) guide or Webflow API documentation.

