cp .env.prod .env
source .env
rm -rf yarn.lock node_modules build
yarn install 
yarn build