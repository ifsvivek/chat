# LLAMA Chat 70b

LLAMA Chat 70b is a chatbot application powered by the LLAMA 70b model. This project is built using SvelteKit, Firebase, and TailwindCSS.

## Table of Contents

- [LLAMA Chat 70b](#llama-chat-70b)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Live Demo](#live-demo)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- Real-time chat powered by LLAMA 70b model
- Firebase authentication
- Responsive design with TailwindCSS
- Open Graph meta tags for better sharing

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/ifsvivek/chat.git
    cd chat
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your Firebase configuration:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

## Usage

To start the development server:
```sh
npm run dev
```

To build the project for production:
```sh
npm run build
```

To preview the production build:
```sh
npm run preview
```
## Live Demo

A live demo of this project is available at [here](https://chat.ifsvivek.tech/)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
