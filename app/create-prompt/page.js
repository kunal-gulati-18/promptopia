'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export const Form = ({ prompt, tags, handleTagChange, handlePromptChange }) => {
	return (
		<>
			<main className="prompts flex flex-col gap-4 ps-4">
				<div className="prompts__div flex flex-col gap-2">
					<label>
						<b>Your AI prompt</b>
					</label>
					<textarea
						className="form_textarea"
						placeholder="Enter a prompt"
						value={prompt}
						onChange={handlePromptChange}
					/>
				</div>
				<div className="prompts__div flex flex-col gap-2">
					<label>
						<b>Tag </b>(#product, #webdevelopment, etc)
					</label>
					<input
						value={tags}
						className="form_input"
						placeholder="Enter tags"
						onChange={handleTagChange}
					/>
				</div>
			</main>
		</>
	);
};
const CreatePrompt = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const [prompt, setPrompt] = useState('');

	const [tags, setTags] = useState('');
	const [loading, setLoading] = useState(false);

	const handlePromptChange = (e) => {
		setPrompt(e.target.value);
	};

	const handleTagChange = (e) => {
		setTags(e.target.value);
	};

	const onSubmit = async (e) => {
		if (!tags || !prompt) return alert('Please enter the required fields');
		setLoading(true);
		const promptData = {
			prompt,
			tags,
			userId: session.user.id,
		};

		try {
			const response = await fetch('/api/prompt/create', {
				method: 'POST',
				body: JSON.stringify(promptData),
			});
			setLoading(false);

			router.push('/');
		} catch (ex) {
			console.log(ex);
		}
	};

	const onCancel = () => {};
	return (
		<div className="w-full">
			<header>
				<h1 className="blue_gradient d-flex text-5xl justify-start font-bold">
					Create prompt
				</h1>
				<p className="mt-4 mb-8">
					Create and share amazing prompts with the world, and let your
					imagination run wild with any AI-powered platform.
				</p>
			</header>
			{/* <main className="prompts flex flex-col gap-4 ps-4">
				<div className="prompts__div flex flex-col gap-2">
					<label>
						<b>Your AI prompt</b>
					</label>
					<textarea
						className="form_textarea"
						placeholder="Enter a prompt"
						value={prompt}
						onChange={handlePromptChange}
					/>
				</div>
				<div className="prompts__div flex flex-col gap-2">
					<label>
						<b>Tag </b>(#product, #webdevelopment, etc)
					</label>
					<input
						value={tags}
						className="form_input"
						placeholder="Enter tags"
						onChange={handleTagChange}
					/>
				</div>
			</main> */}
			<Form
				prompt={prompt}
				tags={tags}
				handlePromptChange={handlePromptChange}
				handleTagChange={handleTagChange}
			/>
			<footer className="flex gap-3 ps-4 mt-6 w-full justify-end">
				<button disabled={loading} className="outline_btn" onClick={onCancel}>
					<Link href="/">Cancel</Link>
				</button>

				<button className="black_btn" onClick={onSubmit}>
					Save
				</button>
			</footer>
		</div>
	);
};

export default CreatePrompt;
