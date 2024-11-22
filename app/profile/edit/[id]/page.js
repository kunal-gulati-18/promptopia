'use client';
import { Form } from '@/app/create-prompt/page';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const EditProfile = ({ params }) => {
	// console.log('params', params.id);
	const { data: session } = useSession();
	const { id } = useParams();
	const router = useRouter();

	const [prompt, setPrompt] = useState(null);
	const [tags, setTags] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleEdit = async () => {
		if (!tags || !prompt) return alert('Please enter the required fields');
		try {
			const response = await fetch(`/api/prompt/${id}`, {
				method: 'PATCH',
				body: JSON.stringify({
					prompt,
					tag: tags,
				}),
			});

			await response.json();

			router.push('/profile');
		} catch (ex) {
			console.error(ex);
		}
	};

	const handlePromptChange = (e) => {
		setPrompt(e.target.value);
	};

	const handleTagsChange = (e) => {
		setPrompt(e.target.value);
	};

	const onCancel = () => {
		router.push('/profile');
	};

	useEffect(() => {
		if (!id || !session?.user) return;

		const getPromptById = async () => {
			setLoading(true);
			try {
				const response = await fetch(`/api/prompt/${id}`, {
					method: 'GET',
				});

				const data = await response.json();

				setPrompt(data.prompt);
				setTags(data.tags);
				setLoading(false);
			} catch (ex) {}
		};

		getPromptById();
	}, [session?.user]);
	return (
		<section className="w-full d-flex flex-col gap-4">
			<header>
				<h1 className="blue_gradient d-flex text-5xl justify-start font-bold">
					Edit prompt
				</h1>
				<p className="mt-4 mb-8">You can edit the prompt here</p>
			</header>
			{loading ? (
				<div>Loading...</div>
			) : (
				<>
					<Form
						prompt={prompt}
						tags={tags}
						handlePromptChange={handlePromptChange}
						handleTagChange={handleTagsChange}
					/>
					<footer className="flex gap-3 ps-4 mt-6 w-full justify-end">
						<button
							disabled={loading}
							className="outline_btn"
							onClick={onCancel}
						>
							Cancel
						</button>

						<button className="black_btn" onClick={handleEdit}>
							Save
						</button>
					</footer>
				</>
			)}
		</section>
	);
};

export default EditProfile;
