// import { getStore, type Store } from '@netlify/blobs';
// import { useEffect, useRef } from 'react';

// export type UseBlobSyncOptions = {
// 	data: unknown;
// 	storeName: string;
// 	siteID: string;
// 	token: string;
// };

// export function useBlobSync({
// 	data,
// 	storeName,
// 	siteID,
// 	token,
// }: UseBlobSyncOptions) {
// 	const storeRef = useRef<Store | null>(null);

// 	useEffect(() => {
// 		storeRef.current = getStore({
// 			name: storeName,
// 			siteID,
// 			token,
// 		});
// 	}, [storeName, siteID, token]);

// 	useEffect(() => {
// 		if (!storeRef.current) {
// 			console.warn('Store not initialized yet');
// 			return;
// 		}

// 		const store = storeRef.current;

// 		console.log('data', data);

// 		store
// 			.setJSON('data', data)
// 			.catch((err) => {
// 				console.error('Error setting data in store:', err);
// 			})
// 			.then((result) => {
// 				console.log('Data synced to blob store', result);
// 			});
// 	}, [data]);
// }
