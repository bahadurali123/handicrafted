import app from "./app.js";
import { Configuration } from "./config/env.config.js";
import connection from "./config/db.config.js";

const port = Configuration.PORT || 3000;

app.listen(port, () => console.log(`Handcrafted app listening on port ${port}!`))