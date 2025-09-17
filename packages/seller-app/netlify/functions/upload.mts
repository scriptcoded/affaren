import { getStore } from '@netlify/blobs';
import type { Context } from '@netlify/functions';

export default async (req: Request, context: Context) => {
	if (req.method !== 'POST') {
		return new Response('Method Not Allowed', { status: 405 });
	}

	const data = await req.json();

	const store = getStore('state');
	const entry = await store.setJSON('data', data);

	return new Response(JSON.stringify(entry), { status: 200 });
};
