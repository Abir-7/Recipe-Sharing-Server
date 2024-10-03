import catchAsync from "../../utils/catchAsync";
import { Payment } from "./payment.model";

export const paymentConfirm = catchAsync(async (req, res) => {
  const { id } = req.query;

  const orderData: any = await Payment.findById(id).populate({
    path: "customer",
    select: "userName email",
  });

  const currentDate = new Date();
  const nextTwoMonths = new Date(
    currentDate.setMonth(currentDate.getMonth() + 2)
  );
  if (!orderData) {
    res.status(404).send("<h1>Booking not found</h1>");
  } else {
    if (orderData) {
      orderData.paymentStatus = "paid";
      orderData.validateFor = nextTwoMonths;
      orderData.save();
    }

    // Extract user details
    const userName = orderData.customer.userName;
    const userEmail = orderData.customer.email;
    const ammout = orderData.amount;
    const validateFor = nextTwoMonths.toDateString(); // Format date

    // HTML response
    res.status(200).send(`<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 20px auto;
                      background-color: #ffffff;
                      padding: 20px;
                      border-radius: 8px;
                      box-shadow: 0 0 10px rgba(0,0,0,0.1);
                  }
                  .header {
                      background-color: rgb(3 7 18);
                      color: #ffffff;
                      padding: 10px;
                      text-align: center;
                      border-radius: 8px 8px 0 0;
                  }
                  .content {
                      padding: 20px;
                  }
                  .content p {
                      font-size: 16px;
                      color: #333333;
                  }
                  .footer {
                      background-color: rgb(3 7 18);
                      color: #ffffff;
                      padding: 10px;
                      text-align: center;
                      border-radius: 0 0 8px 8px;
                      font-size: 14px;
                  }
                  .highlight {
                      font-weight: bold;
                      color: #007BFF;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Order Confirmation</h1>
                  </div>
                  <div class="content">
                      <p>Dear <strong>${userName}</strong>,</p>
                      <p>Your order has been <span class="highlight">confirmed</span> with the following details:</p>
                      <p><strong>User Email:</strong> ${userEmail}</p>
                      <p><strong>Amount:</strong> ${ammout} tk</p>
                      <p><strong>Valid Until:</strong> ${validateFor}</p>
                      <p  style={{ color: 'red' }} >You have to login again to activate your subscription!</p>
                  </div>
                  <div class="footer">
                      &copy; 2024 Food-Corner. All rights reserved. <a style="color: white; font-weight: bold;" href='http://localhost:3000'>Home</a>
                  </div>
              </div>
          </body>
          </html>`);
  }
});
