import User from '@/models/user';
import { connectToDatabase } from '@/utils/connectToDatabase';

export async function GET(request, { params }) {
	const userId = params.id;

	try {
		await connectToDatabase();

		const userDetails = await User.findById(userId);

		if (!userDetails)
			return new Response(JSON.stringify({ message: 'No such user exists' }), {
				status: 404,
			});

		return new Response(JSON.stringify(userDetails), {
			status: 201,
		});
	} catch (ex) {
		return new Response('Failed to fetch user', {
			status: 500,
		});
	}
}
