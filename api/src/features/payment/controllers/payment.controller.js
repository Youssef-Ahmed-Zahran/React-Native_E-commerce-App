import express from "express";

export const getPaypalConfig = (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
};

export const servePaypalCheckout = (req, res) => {
  const total = req.query.total || "0.00";
  const redirectUrl = req.query.redirectUrl || "";
  const clientId = process.env.PAYPAL_CLIENT_ID;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: #0f172a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        #paypal-button-container { width: 100%; max-width: 400px; }
        .loading {
          color: #94a3b8;
          font-size: 14px;
          text-align: center;
          margin-bottom: 16px;
        }
        .total {
          color: #ffffff;
          font-size: 22px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 24px;
        }
        .error {
          color: #f87171;
          font-size: 14px;
          text-align: center;
          margin-top: 16px;
        }
        .success-container {
          text-align: center;
          display: none;
        }
        .success-container h2 {
          color: #4ade80;
          font-size: 24px;
          margin-bottom: 8px;
        }
        .success-container p {
          color: #94a3b8;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <p class="total">Total: $${total}</p>
      <p class="loading" id="loading">Loading PayPal...</p>
      <div id="paypal-button-container"></div>
      <div class="success-container" id="success-container">
        <h2>✅ Payment Approved!</h2>
        <p>Redirecting back to the app...</p>
      </div>
      <p class="error" id="error" style="display:none;"></p>

      <script src="https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture"></script>
      <script>
        document.getElementById('loading').style.display = 'none';

        var redirectUrl = decodeURIComponent('${encodeURIComponent(redirectUrl)}');

        function doRedirect(status, params) {
          var separator = redirectUrl.indexOf('?') >= 0 ? '&' : '?';
          var url = redirectUrl + separator + 'status=' + status;
          if (params) url += '&' + params;

          // Try WebView postMessage (for web iframe)
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ status: status, params: params }));
          } else if (window.parent !== window) {
            window.parent.postMessage(JSON.stringify({ status: status, params: params }), '*');
          }

          // Redirect (for system browser)
          if (redirectUrl) {
            window.location.href = url;
          }
        }

        paypal.Buttons({
          fundingSource: paypal.FUNDING.PAYPAL,
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'pill',
            label: 'pay',
            height: 48,
          },
          createOrder: function(data, actions) {
            return actions.order.create({
              purchase_units: [{
                amount: { value: '${total}' }
              }]
            });
          },
          onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
              document.getElementById('paypal-button-container').style.display = 'none';
              document.getElementById('success-container').style.display = 'block';
              setTimeout(function() {
                doRedirect('success', 'orderID=' + data.orderID);
              }, 800);
            });
          },
          onError: function(err) {
            console.error(err);
            document.getElementById('error').textContent = 'Payment failed: ' + err.toString();
            document.getElementById('error').style.display = 'block';
            setTimeout(function() { doRedirect('error'); }, 1500);
          },
          onCancel: function() {
            doRedirect('cancel');
          },
        }).render('#paypal-button-container');
      </script>
    </body>
    </html>
  `;
  res.send(html);
};
