import { db } from "./src/db-config/db.js" 
import { server } from "./src/Server/Server.js"

const PORT = process.env.PORT || 4000;

// IF DB is connect then start the server
db()
  .then(() => {
    server.listen(PORT, () => console.log(`Server is Running on port ${PORT}`));
  })
  .catch((error) => console.log(error));
