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
import { Numpad } from './numpad';

export type TopUpState =
	| null
	| 'entry'
	| 'scanStart'
	| 'writing'
	| 'error'
	| 'success';

export type Props = {
	state: TopUpState;
	error: string | null;
	value?: number | null;
	onClose: () => void;
	onChange?: (value: number) => void;
	onSubmit?: () => void;
};

export function TopUpDialog({
	state,
	error,
	value,
	onClose,
	onChange,
	onSubmit,
}: Props) {
	const processing = state === 'scanStart' || state === 'writing';

	return (
		<Dialog open={!!state} onClose={onClose} fullWidth>
			<DialogTitle>Ladda kort</DialogTitle>
			<DialogContent>
				{state === 'entry' && (
					<Numpad onChange={onChange} onSubmit={onSubmit} />
				)}

				{state === 'scanStart' && (
					<DialogContentText>Håll kortet nära telefonen.</DialogContentText>
				)}

				{state === 'writing' && (
					<DialogContentText>Håll kortet nära telefonen.</DialogContentText>
				)}

				{state === 'error' && (
					<DialogContentText>
						Något gick fel när kortet lästes.
						<pre>{error}</pre>
					</DialogContentText>
				)}

				{state === 'success' && (
					<DialogContentText>
						<Box
							sx={{
								textAlign: 'center',
							}}
						>
							Kortet är nu laddat med
						</Box>
						<Box
							sx={{
								fontSize: '4rem',
								textAlign: 'center',
								color: 'success.main',
							}}
						>
							{value?.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} kr
						</Box>
					</DialogContentText>
				)}

				{processing && (
					<Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
						<CircularProgress />
					</Box>
				)}
			</DialogContent>

			{state !== 'entry' && (
				<DialogActions>
					<Button onClick={onClose}>{processing ? 'Avbryt' : 'Stäng'}</Button>
				</DialogActions>
			)}
		</Dialog>
	);
}
