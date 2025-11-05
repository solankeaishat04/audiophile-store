🎧 Audiophile E-Commerce Website
A pixel-perfect e-commerce website built with React, TypeScript, and Convex backend for audiophile equipment. Features a complete shopping experience with product browsing, cart management, and automated email confirmations.

✨ Features
Responsive Design: Optimized for mobile, tablet, and desktop

Product Catalog: Headphones, speakers, and earphones with detailed pages

Shopping Cart: Add/remove items, update quantities with persistent storage

Secure Checkout: Comprehensive form validation and payment processing

Order Management: Orders stored securely in Convex backend

Email Confirmation: Automated HTML email sending via Resend API

Order Tracking: View order details and confirmation pages

🛠️ Tech Stack
Frontend: React, TypeScript, Vite, Tailwind CSS

Backend: Convex (Database & Serverless Functions)

Routing: React Router

Email Service: Resend API

Deployment: Vercel (Frontend) + Convex Cloud (Backend)

State Management: React Hooks + Convex Queries

🚀 Getting Started
1. Clone the Repository
bash
git clone https://github.com/your-username/audiophile-store.git
cd audiophile-store
2. Install Dependencies
bash
npm install
3. Set Up Environment Variables
Create a .env file in the root directory:

env
VITE_CONVEX_URL=your_production_convex_url
RESEND_API_KEY=your_resend_api_key
4. Set Up Convex
bash
npx convex dev
npx convex deploy
5. Run Development Server
bash
npm run dev
Open http://localhost:5173 to view the app
Configuration
Convex Setup
bash
# Initialize Convex
npx convex init

# Deploy to production
npx convex deploy

# Export/import data between environments
npx convex export --path convex-export.zip
npx convex import --replace-all convex-export.zip
Email Configuration
Update convex/email.ts with your:

Resend API key

Verified sender email

Custom email template styling

📧 Email Features
Order confirmation with full details

Professional HTML template

Product images and pricing

Shipping information

Grand total breakdown

Mobile-responsive design

🚀 Deployment
Frontend (Vercel)
Connect GitHub repository to Vercel

Set environment variables in Vercel dashboard

Automatic deployments on git push

Backend (Convex)
bash
npx convex deploy
📝 Notes
Ensure all environment variables are properly set for production

Verify email domain with Resend for sending capabilities

Test checkout flow thoroughly before production deployment

Maintain pixel-perfect design across all screen sizes

✨ Live Demo
View Live Application