import mongoose from 'mongoose';
let isConnected = false;
export const connectToDatabase = async () => {
	mongoose.set('strictQuery', true);

	if (isConnected) {
		console.log('Mongo db is already connected');
		return;
	}

	try {
		await mongoose.connect(process.env.MONGO_DB_URI, {
			dbName: 'share_prompt',
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Mongo db connected');
		isConnected = true;
	} catch (ex) {
		console.log(ex);
	}
};
