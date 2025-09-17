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

	if (req.method !== 'POST') {
		return new Response('Method Not Allowed', {
			status: 405,
			headers: CORS_HEADERS,
		});
	}

	const data = await req.json();

	const store = getStore('state');
	const entry = await store.setJSON('data', data);

	return new Response(JSON.stringify(entry), {
		status: 200,
		headers: CORS_HEADERS,
	});
};
