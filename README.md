# Nena Platform

This is a full-stack application with a React frontend and a Python backend.

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* npm
* Python 3.11
* Docker

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/your_project_name.git
   ```
2. Install NPM packages
   ```sh
   cd frontend && npm install
   ```
3. Install Python packages
   ```sh
   source .venv/bin/activate && cd backend && pip install -r requirements.txt
   ```

## Usage

### Without Docker

1. Start the backend server
   ```sh
   source .venv/bin/activate && export PYTHONPATH=$PYTHONPATH:$(pwd)/database && cd backend && uvicorn app.main:app --reload
   ```
2. Start the frontend development server
   ```sh
   cd frontend && npm start
   ```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### With Docker

1. Build and run the containers
   ```sh
   docker-compose -f nena-platform/docker-compose.yml up -d --build
   ```

Open [http://localhost:80](http://localhost:80) to view it in the browser.

## Production

To run the application in a production environment:

```sh
docker-compose -f docker-compose.prod.yml up -d --build
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
