
Cookies Corner — Ready-to-deploy static site with Netlify Functions for email.

Files:
- index.html, about.html, order.html, contact.html
- css/styles.css
- js/script.js
- images/*.jpg (product images)
- functions/sendOrder.js (Netlify function to send emails via SendGrid)

Deployment (Netlify):
1. Create a GitHub repo and push the project files, or drag & drop the folder in Netlify.
2. In Netlify site settings -> Build & deploy -> Environment, add:
   - SENDGRID_API_KEY = <your SendGrid API key>
   - SENDGRID_FROM = orders@cookiescorner.example
   - SENDGRID_TO = your@email.example
3. Netlify will serve the site; the function endpoint will be at /.netlify/functions/sendOrder

Notes:
- The function expects JSON POSTs from the frontend. Contact form sends {type:'contact', name, email, message}.
- Replace placeholder email addresses with real ones.
