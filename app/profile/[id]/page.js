'use client';
import { PromptCard } from '@/components/Feed';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const UserProfile = () => {
	const { id } = useParams();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [promptLoading, setPromptLoading] = useState(true);
	const [prompts, setPrompts] = useState([]);

	useEffect(() => {
		if (!id) return;

		const getUser = async () => {
			setLoading(true);
			const response = await fetch(`/api/user/${id}`, {
				method: 'GET',
			});

			const userDetails = await response.json();

			setLoading(false);
			setUser(userDetails);
		};

		getUser();
	}, []);

	useEffect(() => {
		if (!user) return;

		const getPromptsByUserId = async () => {
			try {
				const response = await fetch(
					'/api/prompt?' +
						new URLSearchParams({
							user: id,
						}),
					{
						method: 'GET',
					}
				);

				const data = await response.json();

				setPromptLoading(false);
				setPrompts(data);
			} catch (ex) {
				console.error(ex);
			}
		};

		getPromptsByUserId();
	}, [user]);
	return (
		<section className='w-full'>
			{loading ? (
				<div>Loading...</div>
			) : user ? (
				<div className="user-profile d-flex flex-col gap-4 w-full">
					<header className="d-flex flex-col gap-2">
						<h1 className="font-bold head_text d-flex gap-2 items-start">
							<Image
								src={user?.image}
								alt="user-logo"
								className="rounded-full"
								height={50}
								width={50}
							/>
							{user?.username || ''}
						</h1>
						<p>{user?.email}</p>
					</header>
					{loading ? <div>Loading Prompts...</div> : null}
					{!loading ? (
						prompts?.length ? (
							<main className='d-flex flex-col gap-3 mt-4'>
                                <p>Prompts created by this user</p>
								{prompts.map((p) => (
									<PromptCard key={p} data={p} enableCardClick={false} />
								))}
							</main>
						) : (
							<div>No prompts has been created by this user</div>
						)
					) : null}
				</div>
			) : null}
		</section>
	);
};

export default UserProfile;
