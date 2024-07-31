import {initServer} from "./app";

async function init() {
    const app = await initServer();
    app.listen(8001, ()=> console.log(`Server started at Port: 8001`));
}

init();