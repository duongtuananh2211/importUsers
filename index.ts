const cryptoJs = require("crypto");

const csv = require("csv-parser");
const fs = require("fs");

const results = [];

const dataImport = [];

fs.createReadStream("users.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    results.forEach((result) => {
      const salt = cryptoJs.randomBytes(10);
      const id = cryptoJs.randomBytes(20).toString("base64");

      const hash = cryptoJs.scryptSync(result.password, salt, 64);

      dataImport.push({
        localId: id,
        email: result.email,
        emailVerified: true,
        passwordHash: hash.toString("base64"),
        salt: salt.toString("base64"),
        displayName: result.displayName,
        providerUserInfo: [],
      });
    });

    fs.writeFile("data.json", JSON.stringify({ users: dataImport }), function (
      err
    ) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  });
