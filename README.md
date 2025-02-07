# Ansari Chat React Project Documentation

Author: [EndeavorPal Technology](https://github.com/EndeavorPal)

This document provides detailed instructions for initializing and deploying the Ansari Chat React project. Adherence to these steps is crucial for successful project setup and execution.

## 1. Initial Requirements

- Begin by cloning the repository. Execute the following command:

  `git clone https://github.com/waleedkadous/ansari-frontend`

- Verify the installation of Node.js and Yarn on your system. These can be downloaded from their respective official sites:

  - [Node.js Download](https://nodejs.org/en/download/current)
  - [Yarn Download](https://classic.yarnpkg.com/en/)

## 2. Environment Setup

- Duplicate the `.env.example` file, rename it to `.env`, and modify the `EXPO_PUBLIC_API_V2_URL`
- Execute `yarn install` to procure all necessary dependencies.

## 3. Local Development Execution

- Initiate the development mode by running `yarn start`.

## 4. Production Deployment

- Update `PUBLIC_URL` and `EXPO_PUBLIC_API_V2_URL` in the `.env` file
- Install a web server, such as [nginx](https://nginx.org/en/download.html), for hosting the production build. Reference the provided sample nginx configuration in the [nginx.conf.sample](nginx.conf.sample) file for setup guidance.
- Generate the production build by executing `yarn build`. Locate the output in the `build` directory.
- Transfer the contents of the `build` folder to the root directory of your web server.
