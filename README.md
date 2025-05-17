# SQL Analytics Assistant

The `SQL Analytics Assistant` project is a React application designed to explore and analyze mental health data through natural language queries. It enables users to ask questions about the dataset and receive insights presented in both chart and table formats.

## Key Features

- **Natural Language Queries**: Users can input questions in natural language to query the mental health dataset.
- **Data Visualization**: Results are displayed in interactive charts (line, bar, pie) and tables for easy understanding.
- **Dark Mode**: Offers a dark mode for improved user experience in low-light environments.
- **Responsive Design**: Provides a responsive user interface suitable for various devices.

## Project Structure

The project is structured into two main directories: `backend` and `frontend`.

```
SQL Analytics Assistant/
├── backend/
│   ├── controller/
│   │   └── aiController.js
│   ├── routes/
│   │   └── aiRoutes.js
│   ├── service/
│   │   └── aiService.js
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/ (if any)
│   │   ├── config/
│   │   │   └── axios.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

### Backend
- **`controller/`**: Contains the `aiController.js` file, which handles request processing and interaction with the AI service.
- **`routes/`**: Includes `aiRoutes.js`, defining the API routes for the backend.
- **`service/`**: Contains `aiService.js`, which interfaces with the Google Generative AI to generate SQL queries and analyze results.
- **`index.js`**: The main entry point for the backend, setting up the Express server, database connection, and middleware.
- **`package.json`**: Lists the backend dependencies and scripts.

### Frontend
- **`public/`**: Contains static assets like `vite.svg`.
- **`src/`**:
    - **`config/`**: Contains `axios.js`, configuring the Axios instance for API requests.
    - **`App.jsx`**: The main application component for the frontend.
    - **`index.css`**: Global CSS file.
    - **`main.jsx`**: Entry point for the React application, rendering the `App` component.

## Technologies Used

### Backend
- **Node.js**: Runtime environment.
- **Express**: Web application framework.
- **mysql2**: MySQL client for Node.js.
- **GoogleGenerativeAI**: For genrating sql querries
- **cors**: For cross-origin communication
- **dotenv**: To access environment variables

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Vite**: Build tool for frontend development.
- **Axios**: HTTP client for making API requests.
- **lucide-react**: Icons library.
- **recharts**: Charting library for React.
- **tailwindcss**: for styling the app
- **"@vitejs/plugin-react"**: To work react in vite

## Environment Variables

The backend relies on several environment variables for configuration:

- `DB_HOST`: Hostname for the MySQL database. Default is `localhost`.
- `DB_USER`: Username for the MySQL database. Default is `root`.
- `DB_PASSWORD`: Password for the MySQL database. Default is `admin`.
- `DB_NAME`: Name of the MySQL database. Default is `mentalhealth`.
- `PORT`: Port number for the Express server. Default is `3000`.
- `GOOGLE_AI_KEY`: API Key for the geminiAI.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/anmol-k14/sqlChat.git
cd sqlChat
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Configure environment variables:

Create a `.env` file in the `backend` directory and add the necessary environment variables. For example:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=admin
DB_NAME=mentalhealth
PORT=3000
GOOGLE_AI_KEY=YOUR_API_KEY
```

4. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server:

```bash
cd backend
node index.js
```

2. Start the frontend development server:

```bash
cd ../frontend
npm run dev
```

The frontend application will be available at `http://localhost:5173`.
