const mongoose = require("mongoose");
require("dotenv").config();

// const { MONGODB_URL } = process.env;

const MONGODB_URL  = "mongodb+srv://teamskillsphere:v7Pe9C85C4Y8ahT8@skillsphere.stnrdkl.mongodb.net/SkillSphere";

exports.connect = () => {
	mongoose
		.connect(MONGODB_URL, {
			useNewUrlparser: true,
			useUnifiedTopology: true,
		})
		.then(console.log(`DB Connection Success`))
		.catch((err) => {
			console.log(`DB Connection Failed`);
			console.log(err);
			process.exit(1);
		});
};
