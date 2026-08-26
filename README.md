# Raksha Bandhan Reel-Style Website — Built-In Photo Editor

Open `index.html` in a browser.

## Change photos without touching code
1. Click **✎ Edit Photos** at the top-right.
2. Choose the Sister/Hero photo and four Memory photos.
3. Use **Crop Position** to change which part of the image is visible.
4. Click **Save Photos**.

The selected images are stored in your browser using localStorage, so refreshing the page keeps them on that browser/device.

## Change names and message
Open `index.html` and replace `[SISTER'S NAME]` and `[YOUR NAME]`. You can also edit the letter and the "You are my..." words.

## Publishing
For a permanent published website, use the customized files on GitHub Pages, Netlify, or Vercel. Note that browser-selected photos are local to the browser; they are not uploaded to a server.


## If a photo does not appear
- Open the site in Chrome, Edge, or Safari.
- Click `✎ Edit Photos`.
- Choose the photo and wait for `Photo added ✓`.
- Click `Save Photos`.
- Refresh the page.

The uploader now automatically scales large phone images down to a maximum side of 1800px and stores them as compressed JPEGs, making large camera/phone files much more reliable.

If the browser says storage is full, click `Reset` and add the photos again.


## Photo upload fixed
This version uses IndexedDB instead of localStorage for the actual photo files. That means several normal phone photos can be stored without hitting the small localStorage quota. Photos are automatically resized and compressed before saving.


## Edit names
Click **✎ Edit Names**, enter both names, and click **Save Names**.
