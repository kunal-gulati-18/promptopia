'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
const Navbar = () => {
	const router = useRouter();
	const pathname = usePathname();
	const { data: session } = useSession();
	// const [isUserLoggedIn, setUserLoggedIn] = useState(true);
	const [providers, setProviders] = useState(null);
	const [toggle, setToggle] = useState(false);

	const handleSetToggle = () => {
		setToggle((prevState) => !prevState); //this is as per react standard
	};

	useEffect(() => {
		const setProvidersFn = async () => {
			const response = await getProviders();
			console.log('res', response);
			setProviders(response);
		};

		setProvidersFn();
	}, []);
	return (
		<nav className="w-full mb-16 pt-3 flex-between">
			<Link href="/" className="flex gap-2 flex-center">
				<Image
					src="/assets/images/logo.svg"
					className="object-contain"
					width={40}
					height={40}
					alt="Promptopia logo"
				/>
				<p className="logo_text">Promptopia</p>
			</Link>
			{/*Desktop nav* */}
			{/* {
				alert(providers)
			} */}
			<div className="sm:flex hidden">
				{session?.user ? (
					<div className="flex gap-3 md:gap-5">
						{pathname.includes('create-prompt') ? null : (
							<Link href="/create-prompt" className="black_btn">
								Create prompt
							</Link>
						)}
						<button
							className="outline_btn"
							onClick={() => {
								router.push('/');
								signOut();
							}}
						>
							Signout
						</button>
						<Link href="/profile">
							<Image
								height={50}
								width={50}
								src={session?.user?.image || '/assets/images/user.svg'}
								alt="My profile"
								className="rounded-full"
							/>
						</Link>
					</div>
				) : (
					<>
						{providers &&
							Object.values(providers).map((provider) => (
								<button
									type="button"
									key={provider.name}
									className="black_btn"
									onClick={() => signIn(provider.id)}
								>
									Signin
								</button>
							))}
					</>
				)}
			</div>

			{/*Mobile nav* */}
			<div className="sm:hidden flex">
				{session?.user ? (
					<>
						{toggle ? (
							<div className="flex flex-col gap-4 sidebar items-center">
								<button
									onClick={handleSetToggle}
									className="top-2 right-2 absolute text-2xl"
								>
									x
								</button>
								{pathname.includes('create-prompt') ? null : (
									<Link
										className="dropdown_link"
										href="/create-prompt"
										onClick={() => setToggle(false)}
									>
										Create prompt
									</Link>
								)}

								<Link
									className="dropdown_link"
									href="/profile"
									onClick={() => setToggle(false)}
								>
									My profile
								</Link>
								<Link
									className="dropdown_link"
									href=""
									onClick={() => {
										signOut();
										router.push('/');
									}}
								>
									Signout
								</Link>
							</div>
						) : (
							<>
								<Image
									className="cursor-pointer"
									onClick={handleSetToggle}
									width={30}
									height={30}
									src="/assets/icons/menu.svg"
									alt="Menu for mobile"
								/>
							</>
						)}
					</>
				) : (
					<>
						{providers &&
							Object.values(providers).map((provider) => (
								<button
									type="button"
									key={provider.name}
									className="black_btn"
									onClick={() => signIn(provider.id)}
								>
									Signin
								</button>
							))}
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
