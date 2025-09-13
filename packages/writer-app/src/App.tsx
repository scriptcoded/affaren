import { Button, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useWakeLock } from 'react-screen-wake-lock';
import { ScanDialog, type ScanState } from './dialogs/scan-dialog';
import { TopUpDialog, type TopUpState } from './dialogs/top-up-dialog';
import { useNfc } from './hooks/nfc';

function App() {
	const { request, release } = useWakeLock({
		reacquireOnPageVisible: true,
	});
	useEffect(() => {
		request();
		return () => {
			release();
		};
	}, [release, request]);

	const [scanState, setScanState] = useState<ScanState>(null);
	const [scanError, setScanError] = useState<string | null>(null);
	const [scanValue, setScanValue] = useState<number | null>(null);

	const [topUpState, setTopUpState] = useState<TopUpState>(null);
	const [topUpError, setTopUpError] = useState<string | null>(null);
	const [topUpValue, setTopUpValue] = useState<number>(0);

	const { scan, write } = useNfc();

	const readAmount = useCallback(async () => {
		setScanError(null);
		setScanState('reading');

		const abortController = new AbortController();

		try {
			const result = await scan(abortController.signal);
			setScanValue(result.amount);
			setScanState('success');
		} catch (error) {
			setScanError(String(error));
			setScanState('error');
		} finally {
			abortController.abort();
		}
	}, [scan]);

	const startTopUp = useCallback(async () => {
		setTopUpState('entry');
	}, []);

	const writeAmount = useCallback(async () => {
		setScanError(null);

		if (topUpValue === 0) {
			setScanError('Du måste ange ett belopp som är större än 0 kr');
			setTopUpState('error');
			return;
		}

		setTopUpState('scanStart');

		const abortController = new AbortController();

		try {
			const currentAmount = await scan(abortController.signal);

			const newValue = Math.max(currentAmount.amount + topUpValue, 0);
			await write(newValue, abortController.signal);
			setScanValue(newValue);
			setTopUpState('success');
		} catch (error) {
			setTopUpError(String(error));
			setTopUpState('error');
		} finally {
			abortController.abort();
		}
	}, [topUpValue, scan, write]);

	// const writeAmount = useCallback(
	// 	async (amount: number) => {
	// 		setOpen(true);

	// 		const abortController = new AbortController();

	// 		try {
	// 			const currentAmount = await scan(abortController.signal);

	// 			await write(currentAmount.amount + amount, abortController.signal);
	// 			alert(`Kortet har laddats med ${amount} kr`);
	// 		} catch (error) {
	// 			console.error(error);
	// 		} finally {
	// 			abortController.abort();
	// 			setOpen(false);
	// 		}
	// 	},
	// 	[scan, write],
	// );

	return (
		<>
			{/* <Box sx={{ height: '90vh', display: 'flex', alignItems: 'flex-end' }}>
				<Box
					sx={{
						padding: 8,
						width: '100%',
					}}
				>
					<Numpad />
				</Box>
			</Box> */}
			<Stack
				spacing={4}
				sx={{
					padding: 2,
					height: '100vh',
					justifyContent: 'center',
				}}
			>
				<Button
					variant="outlined"
					onClick={readAmount}
					size="large"
					sx={{
						height: '4rem',
					}}
				>
					Kolla saldo
				</Button>

				<Button
					variant="contained"
					size="large"
					sx={{
						height: '12rem',
					}}
					onClick={() => startTopUp()}
				>
					Ladda kort
				</Button>
			</Stack>

			<ScanDialog
				state={scanState}
				value={scanValue}
				error={scanError}
				onClose={() => setScanState(null)}
			/>

			<TopUpDialog
				state={topUpState}
				error={topUpError}
				value={scanValue}
				onChange={(value) => setTopUpValue(value)}
				onClose={() => setTopUpState(null)}
				onSubmit={writeAmount}
			/>
		</>
	);
}

export default App;
