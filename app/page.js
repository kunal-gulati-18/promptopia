import Feed from '@/components/Feed';
import Image from 'next/image';

export default function Home() {
	return (
		<section className="flex-col flex-center w-full">
			<h1 className="head_text text-center">
				Discover and share
				<br className="max-md:hidden" />
				<span className="orange_gradient text-center">AI-powered Prompts</span>
			</h1>
			<p className="desc text-center">
				Promptopia is modern tool for creating and sharing creative prompts with
				other users
			</p>
			<Feed /> 
		</section>
	);
}
