This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install the dependencies:
```bash
npm install 
``` 

Then, run the development server:
```bash
npm run dev 
``` 

Open http://localhost:3000 with your browser to see the result.
You can start editing the page by modifying files inside the app directory. The page auto-updates as you edit the file.

Available Scripts
```bash
npm run dev #Starts the development server.
npm run build  #Builds the project for production.
npm run start  #Runs the built project in production mode.
npm run lint  #Lints the project for code quality and style issues.
```
Architecture Decisions:
-> Next.js (App Router): Leveraged for server-side rendering and improved routing capabilities.
-> Redux Toolkit: Manages the application state for cart, search, and user preferences.
-> RTK Query: Handles data fetching and caching efficiently.
-> Tailwind CSS: Used for rapid UI development and custom styling.
-> TypeScript: Ensures type safety and a better developer experience.


Trade-offs Made:
-> Product Detail Data Fetching: Since the given API lacks a product/id endpoint, I fetch all products and filter them on the client side for the product detail page, which is less efficient.
-> Rating as Net Price: Used net_price as a substitute for rating, as the API does not provide a rating field.
-> Category Filtering: Since products have multiple categories (as an array), I consolidated all unique categories using Array.from() and used them for filtering by category.


Future Improvements
-> Optimize Product Detail Page: If a product/id endpoint becomes available, switch to it for more efficient data fetching.
-> Use Pure Server Components: Replace client components in server-side contexts to improve performance and reduce JavaScript payloads.
->Optimize Debouncing : Further fine-tune debounce timing for a more responsive search experience.
