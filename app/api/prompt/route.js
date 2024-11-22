import Prompt from '@/models/prompt';
import { connectToDatabase } from '@/utils/connectToDatabase';
import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request) {
	try {
		await connectToDatabase();

		const user = request.nextUrl.searchParams.get('user') || null;
		const text = request.nextUrl.searchParams.get('text') || '';

		const matchStage = {
			// creator: new ObjectId(user),
		};

		if (user) {
			matchStage.creator = new ObjectId(user);
		}
		// Add text filter only if text exists and is not empty
		if (text && text !== '' && text.trim()) {
			// matchStage.prompt = { $regex: text, $options: 'i' };
			matchStage.$or = [
				{ prompt: { $regex: text, $options: 'i' } },
				{ tags: { $regex: text, $options: 'i' } },
			];
		}

		try {
			const prompts = await Prompt.aggregate([
				// {
				// 	$match: matchStage,
				// },
				{
					$lookup: {
						from: 'users', // The name of the users collection
						localField: 'creator', // The field in the prompts collection
						foreignField: '_id', // The field in the users collection
						as: 'user', // The resulting array field with user data
					},
				},
				{
					$unwind: '$user', // Flatten the array to include a single user object
				},
				{
					$match: {
						...(text &&
							text.trim() && {
								$or: [
									{ prompt: { $regex: text, $options: 'i' } }, // Match text in 'prompt'
									{ tags: { $regex: text, $options: 'i' } }, // Match text in 'tags'
									{ 'user.username': { $regex: text, $options: 'i' } }, // Match text in 'username'
								],
							}),
					},
				},
			]);

			console.log('prompts', prompts);

			return new Response(JSON.stringify(prompts), {
				status: '201',
			});
		} catch (ex) {
			return new Response('Failed to fetch Prompts', {
				status: 500,
			});
		}
	} catch (ex) {}
	return;
}

export async function DELETE(request) {
	const req = await request.json();

	const id = req.id;

	try {
		await connectToDatabase();

		const response = await Prompt.findByIdAndDelete(new ObjectId(id));

		return new Response(JSON.stringify(response), {
			status: 201,
		});
	} catch (ex) {
		return new Response('Failed to connect', {
			status: 500,
		});
	}
}
