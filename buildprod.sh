cp .env.prod .env
source .env
rm -rf yarn.lock node_modules build
yarn install 
yarn build
mkdocs build -c -f docs/mkdocs.yml -d $PWD/build/docs