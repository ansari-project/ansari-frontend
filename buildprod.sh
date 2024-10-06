cp .env.prod .env
source .env
rm -rf yarn.lock node_modules build package-lock.json
yarn install 
yarn add --dev @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier eslint-config-prettier eslint-plugin-prettier
yarn build
