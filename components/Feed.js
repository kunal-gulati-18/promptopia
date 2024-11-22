'use client';
import { debounce } from '@/utils/debounce';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export const PromptCard = ({
	data,
	enableDelete = false,
	enableEdit = false,
	enableCardClick = true,
	handleDelete,
	handleEdit,
}) => {
	const router = useRouter();
	const { data: session } = useSession();
	const [copied, setCopied] = useState('');
	const onCopyClick = () => {
		setCopied(data.prompt);
		navigator.clipboard.writeText(data.prompt);
		setTimeout(() => {
			setCopied(null);
		}, 2000);
	};

	const handleCardClick = () => {
		if (session.user?.id === data.user._id) {
			return router.push(`/profile`);
		}
		router.push(`/profile/${data.user._id}`);
	};
	return (
		<div
			onClick={(e) => {
				e.stopPropagation();
				enableCardClick && handleCardClick();
			}}
			className="prompt_card cursor-pointer d-flex flex-col gap-4"
		>
			<div className="d-flex w-full justify-between align-middle">
				<div className="d-flex gap-3 align-middle flex-start">
					<Image
						width={40}
						height={10}
						alt="user avatar"
						className="rounded-full"
						src={data.user.image}
					/>
					<div className="d-flex flex-col gap-2">
						<p>{data.user.username}</p>
						<p>{data.user.email}</p>
					</div>
				</div>
				<button
					onClick={() => {
						!copied && onCopyClick();
					}}
					className="copy_btn"
				>
					{copied ? (
						<>
							<Image
								width={30}
								height={30}
								src="/assets/icons/tick.svg"
								alt="copied icon"
							/>
						</>
					) : (
						<Image
							width={30}
							height={30}
							src="/assets/icons/copy.svg"
							alt="copy icon"
						/>
					)}
				</button>
			</div>
			<p>{data.prompt}</p>

			<p className="blue_gradient">{data.tags}</p>

			{(enableEdit || enableDelete) && session?.user?.id === data.user._id ? (
				<div className="cta d-flex gap-2">
					<p
						className="blue_gradient cursor-pointer"
						onClick={(e) => {
							e.stopPropagation();
							handleEdit();
						}}
					>
						Edit
					</p>
					<p className="orange_gradient cursor-pointer" onClick={handleDelete}>
						Delete
					</p>
				</div>
			) : null}
		</div>
	);
};
const Feed = () => {
	const { data: session } = useSession();
	// const [searchText, setSearchText] = useState('');
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const ref = useRef(false);
	const callApi = useCallback(async (text) => {
		try {
			setLoading(true);
			const response = await fetch(
				'/api/prompt?' +
					new URLSearchParams({
						// user: session.user?.id,
						text: text || '',
					}).toString(),
				{
					method: 'GET',
				}
			);

			const data = await response.json();
			setData(data);
			setLoading(false);
		} catch (ex) {
			console.log('ex', ex);
		}
	}, []);

	const debounceSearch = debounce(handleSearch, 800);

	const handleSearchText = (e) => {
		const text = e.target.value;
		// setSearchText(text);
		debounceSearch(text);
	};

	function handleSearch(text) {
		callApi(text);
	}
	useEffect(() => {
		if (!session?.user || ref.current) return;
		ref.current = true;
		callApi();
	}, [session?.user]);

	return (
		<section className="d-flex flex-col feed">
			<input
				// value={searchText}
				placeholder="Search by tag, username, prompt"
				onChange={handleSearchText}
				className="search_input"
			/>
			{session?.user ? (
				loading ? (
					<span>Loading Data...</span>
				) : data?.length ? (
					<div className="d-flex gap-4 mt-4">
						{data.map((d, index) => (
							<PromptCard data={d} key={index} />
						))}
					</div>
				) : (
					<div>No data</div>
				)
			) : null}
		</section>
	);
};

export default Feed;
