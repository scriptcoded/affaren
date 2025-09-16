import { create } from 'zustand';

type HardwareStore = {
	port: SerialPort | null;
	writer: WritableStreamDefaultWriter<Uint8Array<ArrayBufferLike>> | null;
	cardAmount: number | null;
	readerInterval: number | null;
	connect: () => Promise<void>;
	sendEject: () => Promise<void>;
	sendSetPrice: (price: number) => Promise<void>;
	sendWriteAmount: (amount: number) => Promise<void>;
};

export const useHardwareStore = create<HardwareStore>((set, get) => ({
	port: null,
	writer: null,
	cardAmount: null,
	readerInterval: null,
	connect: async () => {
		const port = await navigator.serial.requestPort();
		await port.open({ baudRate: 9600 });

		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (!port.writable) {
			throw new Error('Port is not readable');
		}

		if (!port.readable) {
			throw new Error('Port is not readable');
		}

		const writer = port.writable.getWriter();

		const decoder = new TextDecoderStream();
		port.readable.pipeTo(decoder.writable as WritableStream<Uint8Array>);

		const reader = decoder.readable.getReader();

		let readLine = '';
		const readerInterval = setInterval(async () => {
			const { value, done } = await reader.read();
			if (value) {
				readLine += value;
				console.warn(value);
				const lines = readLine.split('\n');

				for (const line of lines.slice(0, -1)) {
					if (!line.startsWith('data:')) continue;

					const data = line.substring(5).trim();

					if (data.startsWith('cardRead:')) {
						const amountStr = data.split(':')[1];
						const amount = parseFloat(amountStr);
						if (!Number.isNaN(amount)) {
							set({ cardAmount: amount });
						}
					}
				}
				readLine = lines[lines.length - 1];
			}
			if (done) {
				console.log('[readLoop] DONE', done);
				reader.releaseLock();
				clearInterval(readerInterval);
				set({ readerInterval: null });
			}
		}, 500);

		set({ port, writer, readerInterval });
	},
	sendEject: async () => {
		const { writer } = get();

		if (!writer) {
			throw new Error('No writer available');
		}

		await writer.write(new TextEncoder().encode('eject\n'));

		set({ cardAmount: null });
	},
	sendSetPrice: async (price: number) => {
		const { writer } = get();

		if (!writer) {
			throw new Error('No writer available');
		}

		await writer.write(new TextEncoder().encode(`setPrice:${price}\n`));
	},
	sendWriteAmount: async (amount: number) => {
		const { writer } = get();

		if (!writer) {
			throw new Error('No writer available');
		}

		await writer.write(new TextEncoder().encode(`writeAmount:${amount}\n`));

		set({ cardAmount: null });
	},
}));
