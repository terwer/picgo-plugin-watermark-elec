npm run build
echo "build success."

rm -rf ./dist
mkdir -p ./dist

cp -r ./lib ./dist/
cp package.json ./dist/
cp README.md ./dist/
cp LICENSE ./dist/
cp logo.png ./dist/
cp -r ./fonts ./dist/
echo "package success."
