export default {
  id: "default",
  url: process.env.MONGO_DB_URL || "mongodb://127.0.0.1:27017/tsed-jwt-auth",
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
