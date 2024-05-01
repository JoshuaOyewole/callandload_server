const moment = require("moment");

const generateHTMLInvoice = (invoice) => {
  const invoiceID = String(invoice._id)?.substring(0, 7);
  const nigerianCurrencyFormat = new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    style: "currency",
  });
  return `
  <!DOCTYPE html>
  <html lang="en, id">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>
        Invoice for Transaction between ${invoice.sellerCompanyName} and ${
    invoice.buyerCompanyName
  }
      </title>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <style>
        @import "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap";
        * {
          margin: 0 auto;
          padding: 0 auto;
          user-select: none;
        }
  
        body {
          padding: 20px;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
            sans-serif;
          -webkit-font-smoothing: antialiased;
          background-color: #dcdcdc;
          font-size:14px
        }
  .mt-l{
    margin-top:4rem;
  }
        .wrapper-invoice {
          display: flex;
          justify-content: center;
        }
        .wrapper-invoice .invoice {
          height: auto;
          background: #fff;
          padding: 5vh;
          margin-top: 5vh;
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dcdcdc;
        }
        .wrapper-invoice .invoice .invoice-information {
          float: right;
          text-align: right;
        }
        .wrapper-invoice .invoice .invoice-information b {
          color: "#0F172A";
        }
        .wrapper-invoice .invoice .invoice-information p {
          font-size: 1.5vh;
          color: gray;
        }
        .wrapper-invoice .invoice .invoice-logo-brand h2 {
          text-transform: uppercase;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
            sans-serif;
          font-size: 2.4vh;
          color: "#0F172A";
        }
        .bold{
            font-weight:700;
        }
        .wrapper-invoice .invoice .invoice-logo-brand img {
          max-width: 100px;
          width: 100%;
          object-fit: fill;
        }
        .wrapper-invoice .invoice .invoice-head {
          display: flex;
          margin-top: 8vh;
        }
        .wrapper-invoice .invoice .invoice-head .head {
          width: 100%;
          box-sizing: border-box;
        }
        .wrapper-invoice .invoice .invoice-head .client-info {
          text-align: left;
        }
        .wrapper-invoice .invoice .invoice-head .client-info h2 {
          font-weight: 500;
          letter-spacing: 0.3px;
          font-size: 1.5vh;
          color: "#0F172A";
        }
        .wrapper-invoice .invoice .invoice-head .client-info p {
          font-size: 1.5vh;
          color: gray;
        }
        .wrapper-invoice .invoice .invoice-head .client-data {
          text-align: right;
        }
        .wrapper-invoice .invoice .invoice-head .client-data h2 {
          font-weight: 500;
          letter-spacing: 0.3px;
          font-size: 1.5vh;
          color: "#0F172A";
        }
        .wrapper-invoice .invoice .invoice-head .client-data p {
          font-size: 1.5vh;
          color: gray;
        }
        .wrapper-invoice .invoice .invoice-body {
          margin-top: 8vh;
        }
        .wrapper-invoice .invoice .invoice-body .table {
          border-collapse: collapse;
          width: 100%;
        }
        .wrapper-invoice .invoice .invoice-body .table thead tr th {
          font-size: 1.5vh;
          border: 1px solid #dcdcdc;
          text-align: left;
          padding: 1vh;
          background-color: #eeeeee;
        }
        .wrapper-invoice .invoice .invoice-body .table tbody tr td {
          font-size: 1.5vh;
          border: 1px solid #dcdcdc;
          text-align: left;
          padding: 1vh;
          background-color: #fff;
        }
        .wrapper-invoice .invoice .invoice-body .table tbody tr td:nth-child(2) {
          text-align: right;
        }
        .wrapper-invoice .invoice .invoice-body .flex-table {
          display: flex;
        }
        .wrapper-invoice .invoice .invoice-body .flex-table .flex-column {
          width: 100%;
          box-sizing: border-box;
        }
        .wrapper-invoice
          .invoice
          .invoice-body
          .flex-table
          .flex-column
          .table-subtotal {
          border-collapse: collapse;
          box-sizing: border-box;
          width: 100%;
          margin-top: 2vh;
        }
        .wrapper-invoice
          .invoice
          .invoice-body
          .flex-table
          .flex-column
          .table-subtotal
          tbody
          tr
          td {
          font-size: 1.5vh;
          border-bottom: 1px solid #dcdcdc;
          text-align: left;
          padding: 1vh;
          background-color: #fff;
        }
        .wrapper-invoice
          .invoice
          .invoice-body
          .flex-table
          .flex-column
          .table-subtotal
          tbody
          tr
          td:nth-child(2) {
          text-align: right;
        }
        .wrapper-invoice .invoice .invoice-body .invoice-total-amount {
          margin-top: 1rem;
        }
        .wrapper-invoice .invoice .invoice-body .invoice-total-amount p {
          font-weight: bold;
          color: "#0F172A";
          text-align: right;
          font-size: 1.5vh;
        }
        .wrapper-invoice .invoice .invoice-footer {
          margin-top: 4vh;
        }
        .wrapper-invoice .invoice .invoice-footer p {
          font-size: 1.2vh;
          color: gray;
        }
  
        .copyright {
          margin-top: 2rem;
          text-align: center;
        }
        .copyright p {
          color: gray;
          font-size: 1.3vh;
        }
  
        @media print {
          .table thead tr th {
            -webkit-print-color-adjust: exact;
            background-color: #eeeeee !important;
          }
  
          .copyright {
            display: none;
          }
        }
        .rtl {
          direction: rtl;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
            sans-serif;
        }
        .rtl .invoice-information {
          float: left !important;
          text-align: left !important;
        }
        .rtl .invoice-head .client-info {
          text-align: right !important;
        }
        .rtl .invoice-head .client-data {
          text-align: left !important;
        }
        .rtl .invoice-body .table thead tr th {
          text-align: right !important;
        }
        .rtl .invoice-body .table tbody tr td {
          text-align: right !important;
        }
        .rtl .invoice-body .table tbody tr td:nth-child(2) {
          text-align: left !important;
        }
        .rtl .invoice-body .flex-table .flex-column .table-subtotal tbody tr td {
          text-align: right !important;
        }
        .rtl
          .invoice-body
          .flex-table
          .flex-column
          .table-subtotal
          tbody
          tr
          td:nth-child(2) {
          text-align: left !important;
        }
        .rtl .invoice-body .invoice-total-amount p {
          text-align: left !important;
        }
      </style>
    </head>
    <body>
      <section class="wrapper-invoice">
        <!-- switch mode rtl by adding class rtl on invoice class -->
        <div class="invoice">
          <div class="invoice-information">
            <p><b>Invoice #</b> : ${invoiceID}</p>
            <p><b>Created Date </b>: ${moment(invoice.createdAt).format(
              "ll"
            )}</p>
            
          </div>
          <!-- logo brand invoice -->
          <div class="invoice-logo-brand">
            <!-- <h2>Tampsh.</h2> -->
            <img src="https://madson-project.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmadsan_logo.4ad514b9.png&w=128&q=75" alt="madsan logo" />
          </div>
          <!-- invoice head -->
          <div class="invoice-head">
            <div class="head client-info">
                <h3>Bill to:</h3>
              <p>${invoice.buyerCompanyName}</p>
              <p>${invoice.email}</p>
              <p>${invoice.buyerPhoneNumber}</p>
            </div>
            <div class="head client-data">
              
              <p>${invoice.sellerCompanyName}</p>
              <p>${invoice.sellerCompanyState}, Nigeria</p>
              <p>${invoice.sellerEmail}</p>
              <p>${invoice.sellerPhoneNumber}</p>
            </div>
          </div>
          <!-- invoice body-->
          <div class="invoice-body">
            <table class="table">
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Marine Diesel Fuel </td>
                  <td>${invoice.quantity}</td>
                  <td>${invoice.productAmount}</td>
                  <td>${nigerianCurrencyFormat.format(invoice.totalCost)}</td>
                </tr>
              </tbody>
            </table>
            <div class="flex-table">
              <div class="flex-column"></div>
              <div class="flex-column">
                <table class="table-subtotal">
                  <tbody>
                    <tr>
                      <td>Subtotal</td>
                      <td>${nigerianCurrencyFormat.format(invoice.totalCost)}</td>
                    </tr>
                    <tr>
                      <td>Discount</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Tax</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- invoice total  -->
            <div class="invoice-total-amount">
              <p>Total : ${nigerianCurrencyFormat.format(invoice.totalCost)}</p>
            </div>
            <div class="mt-l">
              <span>  <span class="bold">Account Number</span>: ${
                invoice.accountNumber
              }</span> <br /><br />
              <span> <span class="bold">Account Name</span>:${
                invoice.accountName
              }</span><br /><br />
              <span> <span class="bold">Bank Name</span>: ${
                invoice.bankName
              }</span><br /><br />
            </div>
          </div>
          <!-- invoice footer -->
          <div class="invoice-footer">
          <h4>Kindly pay the Total Amount to the company Account Details on the Invoice.</h4>
            <p>After successful payment, ensure to send your receipt to the Seller Email for Verification. You can login in to your dashboard from our client portal to always view your Transaction Status.</p>
          </div>
        </div>
       
      </section>
    </body>
  </html>  
  `;
};
module.exports = generateHTMLInvoice;
