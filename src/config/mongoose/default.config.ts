export default {
  id: "default",
  url: process.env.MONGO_DB_URL || "mongodb://127.0.0.1:27017/tsed-jwt-auth",
  connectionOptions: {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};
