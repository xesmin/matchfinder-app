import mongoose from 'mongoose';

const databaseAddress = process.env.MONGODB_URI;

if (!databaseAddress) {
    process.exit(0);
}

mongoose.connect(databaseAddress);
const db = mongoose.connection;

db.on('error', () => {
    console.error("Database connection error.")
});
db.once('open', () => {
    console.log("Connected to database.");
});

export default db;