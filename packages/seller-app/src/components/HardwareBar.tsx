import { Button, Stack, Typography } from '@mui/material';
import { useHardwareStore } from '../hardwareStore';

const toggleFullscreen = () => {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}
};

export function HardwareBar() {
	const port = useHardwareStore((state) => state.port);
	const connect = useHardwareStore((state) => state.connect);

	return (
		<Stack
			direction="row"
			spacing={2}
			alignItems="center"
			justifyContent="center"
			sx={(theme) => ({
				padding: 1,
				backgroundColor: port
					? theme.palette.grey[300]
					: theme.palette.error.light,
				color: port
					? theme.palette.text.primary
					: theme.palette.error.contrastText,
			})}
		>
			<Button
				onClick={toggleFullscreen}
				sx={{
					position: 'absolute',
					left: 16,
					color: 'white',
				}}
			>
				Fullskärm
			</Button>

			<Typography variant="body2" align="center">
				{port ? `Ansluten` : 'Ej ansluten'}
			</Typography>

			{!port && (
				<Button size="small" variant="contained" onClick={connect}>
					Anslut
				</Button>
			)}
		</Stack>
	);
}
