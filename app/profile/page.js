'use client';
import { PromptCard } from '@/components/Feed';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next//navigation';
import React, { useEffect, useRef, useState } from 'react';

const Profile = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const [prompts, setPrompts] = useState([]);
	const [loading, setLoading] = useState([]);
	const callRef = useRef(false);

	const handleDelete = async (id) => {
		try {
			const response = await fetch('/api/prompt', {
				method: 'DELETE',
				body: JSON.stringify({ id }),
			});

			await response.json();

			setPrompts((prev) => prev.filter((pr) => pr._id !== id));
		} catch (ex) {
			console.error(ex);
		}
	};

	const handleEdit = async (prompt) => {
		router.push(`/profile/edit/${prompt._id}`);
		// try {
		// 	const response = await fetch('/api/prompt', {
		// 		method: 'PATCH',
		// 	});

		// 	const newPrompt = await response.json();
		// 	setPrompts((prev) =>
		// 		prev.map((np) =>
		// 			newPrompt._id === np._id ? { ...newPrompt } : { ...np }
		// 		)
		// 	);
		// } catch (ex) {
		// 	console.error(ex);
		// }
	};
	useEffect(() => {
		if (!session?.user || callRef.current) return;

		callRef.current = true;

		const callApi = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					'/api/prompt?' +
						new URLSearchParams({
							user: session?.user?.id,
						}).toString(),
					{
						method: 'GET',
					}
				);

				const data = await response.json();
				setPrompts(data);
				setLoading(false);
			} catch (ex) {}
		};

		callApi();
	}, [session?.user]);

	return (
		<section className="profile d-flex flex-col gap-4 w-full">
			<header className="d-flex flex-col gap-2">
				<h1 className="blue_gradient font-bold head_text">My profile</h1>
				<p>Welcome to your personalized profile page</p>
			</header>
			<main>
				{loading ? (
					<div>Loading...</div>
				) : prompts?.length ? (
					<div className="d-flex gap-3">
						{prompts?.map((p, idx) => (
							<PromptCard
								key={idx}
								data={p}
								handleDelete={() => {
									handleDelete(p._id);
								}}
								handleEdit={() => {
									handleEdit(p);
								}}
								enableDelete
								enableEdit
							/>
						))}
					</div>
				) : (
					<div>No data</div>
				)}
			</main>
		</section>
	);
};

export default Profile;
