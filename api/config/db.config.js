const mongoose = require("mongoose");

mongoose
	.connect(
		`mongodb+srv://nicolastombal01:Nsip6T811pvXkQ94@arya-cluster-0.o845w5n.mongodb.net/?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => console.log("Connection to DataBase etablished"))
	.catch((err) => console.log(err));
