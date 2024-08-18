# Questions Forum

## Overview

This project is a Questions Forum application that allows users to register, log in, ask questions, and provide answers. The platform supports both teachers and students, with specific features tailored to each role. Users can edit or delete their own questions and answers, making it a dynamic and interactive environment for exchanging knowledge.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Environment Setup](#environment-setup)
- [Contributing](#contributing)
- [License](#license)

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   Use the command `git clone <repository-url>` in your terminal.
   ```
2. **Navigate to the project directory:**
   - Use the following command in your terminal to enter the backend of the project folder:
   ```bash
   cd path/to/the/project/portfolio-tweede-zit-v2-SoulaimanOuladBenTayeb/build/images/api
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

## Usage

Once you have installed the dependencies, navigate back to the root of the project by running:
```bash
cd ../../..
```

## Environment Setup

To set up the environment variables, follow these steps:

1. **Copy `.env.example` to `.env` and `.env.example.test` to `.env.test` :**
   ```bash
   cp .env.example .env
   cp .env.example.test .env.test
   ```
2. **Edit `.env` and `.env.test` with your specific environment settings:**
   - `DB_HOST`: Your database host (e.g., `localhost`)
   - `DB_USER`: Your database username
   - `DB_PASSWORD`: Your database password
   - `DB_NAME`: Your main database name
   - `DB_NAME_TEST`: Your test database name
   - `JWT_SECRET`: Your JWT secret key

### Running the Application
- **Before you start the application, make sure to open docker first**
To start the application, run:
```bash
docker-compose up --build
```
The application will start on `http://localhost:3000`.

### Running Tests
The tests are currently not working, but maybe you would like to take a look.

To run the tests, use:
```bash
npm test
```
This will execute all the unit tests for the application.

## Features

- **User Authentication**: Register and log in with secure JWT-based authentication.
- **Role Management**: Supports both teacher and student roles, with permissions specific to each role.
- **CRUD Operations**:
  - Questions: Users can create, read, update, and delete their questions.
  - Answers: Users can post answers to questions, as well as edit or delete their answers.
- **Responsive Design**: The application is designed to work on all devices.

## Technologies Used

- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework for Node.js.
- **PostgreSQL**: Relational database.
- **Knex.js**: SQL query builder for Node.js.
- **JWT**: JSON Web Tokens for authentication.
- **Docker**: Containerization of the application.
- **Three.js**: JavaScript library for creating 3D graphics in the browser.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
