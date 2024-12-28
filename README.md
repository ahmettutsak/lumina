# Lumina

This project is a mockup e-commerce platform created to demonstrate my skills in full-stack development. It highlights my ability to build modern, responsive, and functional web applications.

## Features

- **Dynamic Artwork Listings**: Display artworks dynamically fetched from a Supabase backend.
- **User Authentication**: Secure sign-up, login, and session management powered by Supabase Auth.
- **Artwork Categorization**: Browse artworks by categories such as Portraits, Landscapes, Abstract, and Digital Art.
- **Digital Delivery**: Purchased artworks can be downloaded or sent directly to the user via email.
- **Responsive Design**: Fully optimized for desktop and mobile devices.

## Tech Stack

### Frontend

- **Next.js**: Framework for server-side rendering and static site generation.
- **React**: Frontend library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.

### Backend

- **Supabase**: Database and authentication services.
- **PostgreSQL**: Relational database system provided by Supabase.

### Deployment (Future)

- The project is intended to be hosted on Vercel but is not yet deployed.

## Installation and Setup

Follow these steps to run the project locally:

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Supabase account

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ahmettutsak/lumina.git
   cd lumina
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Supabase**:

   - Create a Supabase project at [Supabase](https://supabase.com/).
   - Add a `products` table with appropriate columns (e.g., `id`, `name`, `description`, `price`, `image_url`, `category`).
   - Enable authentication in Supabase.

4. **Add environment variables**:

   - Create a `.env.local` file in the root directory and add the following:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

5. **Run the development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

6. **Build for production** (optional):
   ```bash
   npm run build
   npm start
   ```

## Demo

A live demo will be added in the future.

## Screenshots

Screenshots will be added in the future.

## Future Improvements

- Add enhanced search and filtering for artworks.
- Integrate user authentication.
- Enable multi-language support for a global audience.
- Add animations and micro-interactions.

## License

This project does not currently have a license.

---

Feel free to reach out with feedback!

## Contact

- **Name**: Ahmet Tutsak
- **Email**: ahmettutsak@hotmail.com
- **GitHub**: [ahmettutsak](https://github.com/ahmettutsak)
