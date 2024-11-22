import Prompt from '@/models/prompt';
import { connectToDatabase } from '@/utils/connectToDatabase';

export async function GET(request, { params }) {
	try {
		await connectToDatabase();

		const prompt = await Prompt.findById(params.id);

		if (!prompt)
			return new Response('No prompt with this id exists', {
				status: 404,
			});

		return new Response(JSON.stringify(prompt), {
			status: 201,
		});
	} catch (ex) {
		return new Response('Failed to fetch prompt', {
			status: 500,
		});
	}
}

export async function PATCH(request, { params }) {
	const { prompt, tag } = await request.json();

	try {
		await connectToDatabase();

		const updatedPrompt = await Prompt.findByIdAndUpdate(params.id, {
			prompt,
			tags: tag,
		});

		if (!updatedPrompt)
			return new Response('No prompt exists', {
				status: 404,
			});

		return new Response(JSON.stringify(updatedPrompt), {
			status: 201,
		});
	} catch (ex) {
		return new Response('Failed to update prompt', {
			status: 500,
		});
	}
}
