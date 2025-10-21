
import { db } from "./src/db-config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

// IF DB is connect then start the server
db()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is Running on port ${PORT}`));
  })
  .catch((error) => console.log(error));
