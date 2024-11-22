import React from 'react';

export async function generateMetadata({ params }) {
	const obj = await new Promise((res) =>
		setTimeout(() => res({ name: 'ok' }), 1000)
	);

	return { title: obj.name };
}

const UniqueBlog = ({ params }) => {
	return <div>UniqueBlog: {params.id} </div>;
};

export default UniqueBlog;
