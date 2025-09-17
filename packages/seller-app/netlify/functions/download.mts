import { getStore } from '@netlify/blobs';
import type { Context } from '@netlify/functions';

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': '*',
	'Access-Control-Allow-Headers': '*',
};

export default async (req: Request, context: Context) => {
	if (req.method === 'OPTIONS') {
		return new Response(null, { status: 204, headers: CORS_HEADERS });
	}

	if (req.method !== 'GET') {
		return new Response('Method Not Allowed', {
			status: 405,
			headers: CORS_HEADERS,
		});
	}

	const store = getStore('state');
	const entry = await store.get('data');

	return new Response(entry, {
		status: 200,
		headers: {
			...CORS_HEADERS,
			'Content-Type': 'application/json',
		},
	});
};
