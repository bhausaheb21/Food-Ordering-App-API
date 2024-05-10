# 🍔📱 Food Order App API

Welcome to the Food Order App API! This API serves as the backend for a food ordering application, providing a seamless experience for vendors and customers alike.

## 🚀 Features

- **Vendor Management**: Register vendors, manage profiles, and track orders efficiently.
- **Customer Experience**: Enable customers to sign up, log in, place orders, and track delivery status.
- **OTP Authentication**: Ensure secure authentication with OTP validation during signup.
- **Order Management**: Create, process, and track orders in real-time.
- **Offer Management**: Create and manage special offers for customers.
- **Transaction Tracking**: Monitor transaction history for financial analysis and reporting.
- **Image Upload**: Allow vendors to upload images for food items and cover photos.

## ⚙️ Technologies Used

- **Node.js**: Runtime environment for server-side JavaScript.
- **Express**: Web framework for building robust APIs.
- **MongoDB**: NoSQL database for storing application data.
- **Multer**: Middleware for handling file uploads.
- **JWT**: JSON Web Tokens for secure authentication.
- **Mongoose**: MongoDB object modeling for Node.js.
- **React Native**: Framework for building cross-platform mobile apps.
- **REST API**: Architecture for communication between the frontend and backend.

## 📝 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/food-order-app-api.git
   
2. Navigate to the project directory:

   ```bash
   cd food-order-app-api
    
3. Install dependencies:

   ```bash
   npm install
    
4. Set up environment variables. Create a .env file in the root directory and add the following:
   ```bash
    PORT=3000
    MONGODB_URI=<your_mongodb_uri>
    SECRET_KEY = <your_secret_key>
    accountSid=<your_twilio_account_sid>
    authToken=<your_twilio_authToken>
    
5. Start the Server

   ```bash
   npm start

## 📚 API Endpoints

- **For Customers**: `/api/customers`
- **For Vendors**: `/api/vendors`
- **For Admins**: `/api/admin`


**Happy coding! 🚀**
