import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';

export type ScanState = null | 'reading' | 'error' | 'success';

export type Props = {
	state: ScanState;
	value: number | null;
	error: string | null;
	onClose: () => void;
};

export function ScanDialog({ state, value, error, onClose }: Props) {
	return (
		<Dialog open={!!state} onClose={onClose} fullWidth>
			<DialogTitle>Kolla saldo</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{state === 'reading' &&
						'Håll kortet nära telefonen för att kolla saldot.'}
					{state === 'error' && (
						<>
							Något gick fel när kortet lästes.
							<pre>{error}</pre>
						</>
					)}
					{state === 'success' && (
						<>
							<Box
								sx={{
									textAlign: 'center',
								}}
							>
								Kortet är laddat med
							</Box>
							<Box
								sx={{
									fontSize: '4rem',
									textAlign: 'center',
									color: 'success.main',
								}}
							>
								{value?.toLocaleString('sv-SE', { maximumFractionDigits: 2 })}{' '}
								kr
							</Box>
						</>
					)}
				</DialogContentText>

				{state === 'reading' && (
					<Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
						<CircularProgress />
					</Box>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>
					{state === 'reading' ? 'Avbryt' : 'Stäng'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
