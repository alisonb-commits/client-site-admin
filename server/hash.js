const bcrypt = require("bcrypt");

(async () => {
  const password = "password123"; // change if you want
  const hash = await bcrypt.hash(password, 10);
  console.log("PASSWORD:", password);
  console.log("HASH:", hash);
})();
