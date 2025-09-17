import { useEffect, useRef, useState } from 'react';
import { debounce } from './utils/debounce';
import type { Product } from './productsStore';

async function uploadState(data: unknown) {
	const response = await fetch(
		'https://affaren-seller.netlify.app/.netlify/functions/upload',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		},
	);

	if (!response.ok) {
		throw new Error(`Failed to upload state: ${response.statusText}`);
	}

	const result = await response.json();
	return result;
}

export function useStateSync(data: unknown) {
	const debouncedUpload = useRef(
		debounce((data: unknown) => {
			uploadState(data)
				.then((result) => {
					console.log('State uploaded successfully:', result);
				})
				.catch((error) => {
					console.error('Error uploading state:', error);
				});
		}, 500),
	);

	useEffect(() => {
		debouncedUpload.current(data);
	}, [data]);
}

const fetchState = async () => {
	const res = await fetch(
		'https://affaren-seller.netlify.app/.netlify/functions/download',
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);

	return res.json();
};

export function useFetchState(interval: number) {
	// Fetches state every 3 seconds

	const [state, setState] = useState<Product[]>([]);

	useEffect(() => {
		const int = setInterval(() => {
			fetchState()
				.then((data) => {
					setState(data);
				})
				.catch((error) => {
					console.error('Error fetching state:', error);
				});
		}, interval);

		return () => clearInterval(int);
	}, [interval]);

	useEffect(() => {
		fetchState()
			.then((data) => {
				setState(data);
			})
			.catch((error) => {
				console.error('Error fetching state:', error);
			});
	}, []);

	return state;
}
