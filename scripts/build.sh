mkdir prod 2>/dev/null
mkdir prod/components 2>/dev/null
prettier --write "src/**/*.ts"
tsc || exit 1
if [ "$1" == "dev" ]
then
    cat << EOF > prod/app.js
console.info('This app is built with development server. To compile app in production mode use "kach build --prod" command.');
var es = new EventSource("/sse");
es.onmessage = () => {
    console.log("Update detected. Reloading...");
    location.reload();
};
$(cat prod/app.js)
EOF
fi
uglifyjs prod/app.js -o prod/app.js
cp src/index.html prod/
cp src/components/**/*.html prod/components/
sass src/components/app-root/app-root.sass prod/styles.css --no-source-map || exit 1