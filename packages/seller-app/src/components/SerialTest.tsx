const startSerial = async () => {
	try {
		const port = await navigator.serial.requestPort();

		port.addEventListener('connect', () => {
			console.log('Serial connected');
		});
		await port.open({ baudRate: 9600 });

		await new Promise((resolve) => setTimeout(resolve, 2000));

		await port.writable
			?.getWriter()
			.write(new TextEncoder().encode('Hello from web serial!\n'));

		console.log('Wrote');

		const decoder = new TextDecoderStream();

		if (!port.readable) {
			throw new Error('Port is not readable');
		}

		port.readable.pipeTo(decoder.writable as WritableStream<Uint8Array>);

		const inputStream = decoder.readable;
		const reader = inputStream.getReader();

		while (true) {
			const { value, done } = await reader.read();
			if (value) {
				console.log('From serial:', value);
			}
			if (done) {
				console.log('[readLoop] DONE', done);
				reader.releaseLock();
				break;
			}
		}
	} catch (error) {
		console.error('Serial error:', error);
	}
};

export function SerialTest() {
	return (
		<button type="button" onClick={startSerial}>
			Start Serial
		</button>
	);
}
