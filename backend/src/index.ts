import app, { connectMongoose } from "./app";

async function main() {
    try {
        await connectMongoose("mongodb://localhost:27017/thatSushiGame");
    } catch (err) {
        process.stderr.write(`Failed to connect to MongoDB: ${err}\n`);
        process.exit(-1);
    }

    app.listen(process.env.PORT || 3000);
}

main();
