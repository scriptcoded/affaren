export function useNfc() {
	const scan = (signal: AbortSignal) => {
		return new Promise<{ amount: number }>((resolve, reject) => {
			const ndef = new NDEFReader();

			ndef
				.scan({
					signal,
				})
				.catch(reject)
				.then(() => {
					ndef.addEventListener('readingerror', () => {
						reject(new Error('Läsningen misslyckades.'));
					});

					ndef.addEventListener('reading', ({ message }) => {
						try {
							const decoder = new TextDecoder();

							if (message.records.length === 0) {
								return resolve({ amount: 0 });
							}

							const text = decoder.decode(message.records[0].data);
							let amount = Number.parseFloat(text);

							if (Number.isNaN(amount)) {
								amount = 0;
							}

							resolve({ amount });
						} catch (e) {
							reject(e);
						}
					});
				});
		});
	};

	const write = (amount: number, signal: AbortSignal) => {
		return new Promise<void>((resolve, reject) => {
			const ndef = new NDEFReader();

			ndef
				.write(`${amount}`, {
					overwrite: true,
					signal,
				})
				.then(resolve)
				.catch(reject);
		});
	};

	return {
		scan,
		write,
	};
}
