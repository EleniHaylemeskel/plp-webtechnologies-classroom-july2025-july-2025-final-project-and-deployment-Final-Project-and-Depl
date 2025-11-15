
const fetch = require('node-fetch');
exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const data = JSON.parse(event.body);
    const sgKey = process.env.SENDGRID_API_KEY;
    const from = process.env.SENDGRID_FROM || 'orders@cookiescorner.example';
    const to = process.env.SENDGRID_TO || process.env.SENDGRID_FROM || 'orders@cookiescorner.example';
    if (!sgKey) return { statusCode: 500, body: 'SendGrid API key not configured' };

    let subject = 'Cookies Corner — New Order';
    let content = 'Order details:\n' + JSON.stringify(data, null, 2);
    if(data.type && data.type === 'contact'){
      subject = `Cookies Corner — Contact message from ${data.name || 'visitor'}`;
      content = `Contact message:\nName: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`;
    } else if(data.flavor){ // assume order
      subject = `New Order from ${data.name || 'customer'}`;
      content = `Order details:\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nFlavor: ${data.flavor}\nQuantity: ${data.quantity}\nDelivery: ${data.delivery}\nMessage on cookie: ${data.message_on_cookie || ''}\nIngredients: ${data.ingredients || ''}\nNotes: ${data.notes || ''}`;
    }

    const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + sgKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from },
        subject: subject,
        content: [{ type: 'text/plain', value: content }]
      })
    });

    if(!resp.ok){
      const text = await resp.text();
      return { statusCode: 502, body: 'SendGrid error: ' + text };
    }
    return { statusCode: 200, body: JSON.stringify({ message: 'Email sent' }) };
  } catch(err) {
    return { statusCode: 500, body: 'Server error: ' + String(err) };
  }
};
