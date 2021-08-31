const fs = require("fs");
const path = require("path");

/* const getAll = dir => {
  // Read files at _posts/{directory}
  const directory = path.join(process.cwd(), `_posts/${dir}`);
  const fileNames = fs.readdirSync(directory);
  // Get the content of the files as JSON
  const content = fileNames.map(fileName => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(directory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    return {
      slug,
      ...matterResult
    };
  });
  // Return a big array of JSON
  return JSON.stringify(content);
};

const allPosts = getAll("blog");

const postFileContents = `${allPosts}`;
 */
try {
  fs.readdirSync("public/themes");
} catch (e) {
  fs.mkdirSync("public/themes");
}

function cloneFileToPath(file, newPath) {
    var readStream = fs.createReadStream(path.join(process.cwd(), `themes/${file}`));
    var writeStream = fs.createWriteStream(path.join(process.cwd(), `public/themes/${newPath}`));

    readStream.on('error', console.error);
    writeStream.on('error', console.error);

    readStream.on('close', function () {
        fs.unlink(path.join(process.cwd(), `themes/${file}`), console.log);
    });

    readStream.pipe(writeStream);
}

console.log(cloneFileToPath("default.json", "default.json"))

/* // Create our cached posts JSON
fs.writeFile("public/cache/posts.json", postFileContents, err => {
  if (err) return console.log(err);
  console.log("Posts cached.");
}); */