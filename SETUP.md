# Setup

## Prerequisites

1. Make sure you have [Node.js](https://nodejs.org/en/) v20 installed.
    - Use `node --version` from your terminal to check the version, make sure it's v20.x.x
2. Setup your VS Code with extensions - [Click here](https://gist.github.com/dotnize/47769c47114d7b7ba9a07df90cf416ca).
    - Only the Prettier VSCode extension is required, other extensions are **optional**, but still please follow the configuration from no. 2 in the guide.

## Cloning & running the project

1. Clone this project:
    ```sh
    git clone git@github.com:dotnize/badi-server.git
    ```
    if it doesn't work, try the https url:
    ```sh
    git clone https://github.com/dotnize/badi-server.git
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file at the root directory of the project with the following variables:

    ```sh
    PORT=3001 # replace with any port you want

    # MySQL database connection details
    MYSQL_HOST=localhost
    MYSQL_PORT=3306
    MYSQL_DATABASE=badi
    MYSQL_USER=root
    MYSQL_PASSWORD=
    ```

4. Run the project in development mode:
    ```sh
    npm run dev
    ```
5. The server is now running locally at `http://localhost:3001` (or whatever port you chose in the `.env` file).

For testing the API, you may use [Insomnia](https://insomnia.rest/download) or [Postman](https://www.postman.com/downloads/).
