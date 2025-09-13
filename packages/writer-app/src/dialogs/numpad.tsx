import CheckIcon from '@mui/icons-material/Check';
import IconBackspace from '@mui/icons-material/Backspace';
import { Box, Button, Grid, Stack } from '@mui/material';
import { useEffect, useState, type ReactNode } from 'react';

type ButtonConfig = {
	type: 'number' | 'backspace' | 'minus' | 'submit';
	label?: string | ReactNode;
};

const buttons: ButtonConfig[] = [
	{ type: 'number', label: '1' },
	{ type: 'number', label: '2' },
	{ type: 'number', label: '3' },
	{ type: 'number', label: '4' },
	{ type: 'number', label: '5' },
	{ type: 'number', label: '6' },
	{ type: 'number', label: '7' },
	{ type: 'number', label: '8' },
	{ type: 'number', label: '9' },
	{ type: 'minus' },
	{ type: 'number', label: '0' },
	{ type: 'submit', label: <CheckIcon /> },
];

export type Props = {
	onChange?: (value: number) => void;
	onSubmit?: () => void;
};

export function Numpad({ onChange, onSubmit }: Props) {
	const [negative, setNegative] = useState(false);
	const [value, setValue] = useState<number>(0);

	useEffect(() => {
		onChange?.(negative ? -value : value);
	}, [value, negative, onChange]);

	const onButtonClick = (button: ButtonConfig) => {
		if ('vibrate' in navigator) {
			navigator.vibrate(1);
		}

		if (button.type === 'number') {
			const digit = Number(button.label);
			setValue((prev) => {
				const newValue = prev * 10 + digit;
				return newValue > 9999999 ? prev : newValue;
			});
		} else if (button.type === 'backspace') {
			setValue((prev) => Math.floor(prev / 10));
		} else if (button.type === 'minus') {
			setNegative((prev) => !prev);
		} else if (button.type === 'submit') {
			onSubmit?.();
		}
	};

	return (
		<Stack>
			<Box
				sx={{
					display: 'flex',
					width: '100%',
				}}
			>
				<Box
					sx={{
						flex: 1,
						display: 'flex',
						minWidth: 0,
						alignItems: 'center',
						fontSize: '2rem',
						justifyContent: 'flex-start',
						color: negative ? 'error.main' : 'success.main',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					{negative ? '− ' : '+ '}
					{value.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} kr
				</Box>
				<Button
					variant="text"
					sx={{
						fontSize: '2rem',
					}}
					onClick={() => onButtonClick({ type: 'backspace' })}
				>
					<IconBackspace />
				</Button>
			</Box>
			<Grid container spacing={1}>
				{buttons.map((button, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: The array is static.
					<Grid key={i} size={4}>
						<Button
							variant="text"
							sx={{
								width: '100%',
								aspectRatio: '1/1',
								fontSize: '2rem',
							}}
							onClick={() => onButtonClick(button)}
							disabled={button.type === 'submit' ? value === 0 : false}
						>
							{button.type === 'minus' ? (negative ? '+' : '–') : button.label}
						</Button>
					</Grid>
				))}
			</Grid>
		</Stack>
	);
}
