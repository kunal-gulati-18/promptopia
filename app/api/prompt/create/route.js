import Prompt from '@/models/prompt';
import { connectToDatabase } from '@/utils/connectToDatabase';

export async function POST(request) {
	const { prompt, tags, userId } = await request.json();
	try {
		await connectToDatabase(); //it is like a lamba function, whenever it is called then a server is spinned up, once job is completed it goes to rest

		const newPrompt = new Prompt({
			creator: userId,
			tags,
			prompt,
		});

		await newPrompt.save();

		return new Response(JSON.stringify(newPrompt), {
			status: 201,
		});
		// const response = await Prompt.Fi
	} catch (ex) {
        console.log(ex)
		return new Response('Failed to create a new Prompt', {
			status: 500,
		});
	}
}
