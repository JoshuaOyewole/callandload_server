const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");
const err = require("../middleware/error");
const { StatusCodes } = require("http-status-codes"); // Assuming you're using 'http-status-codes' package for HTTP status codes
const Invoice = require("../models/invoice"); // Assuming you have a model for Invoice
const generateHTMLInvoice = require("../util/generateHTMLInvoice");
const sendEmail = require("../util/sendEmail");

const { AUTH_EMAIL } = process.env;

async function generateInvoicePdf(req, res, next) {
  try {
    const invoiceId = req.body.invoiceId;

    // Fetch the invoice details from the database
    const invoice = await Invoice.findById(invoiceId);

    // If invoice not found, return 404
    if (!invoice) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Oops! Invoice details not found",
      });
    }

    // Generate HTML document for the invoice
    const invoice_document = generateHTMLInvoice(invoice);

    // Launch Puppeteer browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(invoice_document);

    // Generate PDF buffer
    const pdfBuffer = await page.pdf({
      format: "A4",
      width: "300mm",
      height: "200mm",
      margin: {
        left: "5px",
        right: "6px",
      },
    });

    // Close the browser
    await browser.close();

    // Setup email data
    const invoiceID = String(invoice._id)?.substring(0, 7);
    const nigerianCurrencyFormat = new Intl.NumberFormat("en-NG", {
      currency: "NGN",
      style: "currency",
    });
    let mailOptions = {
      from: AUTH_EMAIL,
      to: ["joshuaoyewole20@gmail.com", "johncross@mailinator.com"], // recipient's email
      subject: `Your Order Confirmation and Invoice for Order #${invoiceID}`,
      //text: "Plaintext version of the message",
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Your Order Confirmation and Invoice for Order #${invoiceID}</title>
      
          <style>
              body{
                  font-size: 16px;
              }
              .block{
                  display: block;
              }
              .bold{
                font-weight:600;
              }
          </style>
        </head>
        <body>
          <p class="bold">Dear ${invoice.buyerCompanyName},</p>
          <p>
            We're thrilled to inform you that your recent purchase from ${
              invoice.sellerCompanyName
            }
            has been successfully initiated! Thank you for choosing ${
              invoice.sellerCompanyName
            }.
          </p>
          <p>Below, you'll find the details of your order:</p>
          <ul>
            <li>Order Number: #${invoiceID}</li>
            <li>Product Name: Marine Diesel Fuel</li>
            <li>Quantity: ${invoice.quantity}</li>
            <li>Total Amount: ${nigerianCurrencyFormat.format(
              invoice.totalCost
            )}</li>
            <li>Destination: ${invoice.buyerDestination}</li>
          </ul>
          <p>
            If you have any questions or concerns regarding your order, feel free to
            contact ${invoice.buyerCompanyName} at ${invoice.sellerEmail} or ${
        invoice.sellerPhoneNumber
      }.
          </p>
          <p>
            We greatly appreciate your business and hope you enjoy your new purchase.
            Thank you for choosing ${invoice.buyerCompanyName}.
          </p>
      
          <p>
            Best regards,
            <span class="block"> ${invoice.sellerCompanyName}</span>
          </p>
        </body>
      </html>
      `,
      attachments: [
        {
          filename: `${invoice.buyerCompanyName}_invoice.pdf`, // Name of the attachment
          content: pdfBuffer, // Attach PDF buffer
        },
      ],
    };

    // Send email
    await sendEmail(mailOptions);

    // Send the PDF as response
    /*   res.setHeader(
      "content-Disposition",
      `attachment; filename=${invoice.buyerCompanyName}_invoice.pdf`
    );
    res.set({ "content-Type": "application/pdf" });
    res.send(pdfBuffer); */
    res.status(200).json({ msg: "Sent successfully!", status: 200 });
  } catch (error) {
    next(err(error));
  }
}

module.exports = generateInvoicePdf;
