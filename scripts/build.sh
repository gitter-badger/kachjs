mkdir prod 2>/dev/null
mkdir prod/components 2>/dev/null
prettier --write "src/**/*.ts"
tsc || exit 1
cp src/index.html prod/
cp src/components/**/*.html prod/components/
sass src/components/app-root/app-root.sass prod/styles.css --no-source-map || exit 1