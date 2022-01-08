const fs = require("fs");

fs.mkdir("./backend/data", (err) => {
  if (err) {
    console.log(err);
  }
  console.log("success");
});
