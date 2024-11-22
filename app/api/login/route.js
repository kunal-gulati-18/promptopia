export async function GET(request) {
	const users = [
		{
			id: 1,
			name: 'KG',
		},
	];
	return new Response(JSON.stringify(users));
}
