import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import {
	Box,
	IconButton,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import type { Product } from '../productsStore';
import { getDiscountPercentage } from '../utils';
import { useHardwareStore } from '../hardwareStore';

export type Props = {
	product: Product;
	count?: number;
	onAdd?: () => void;
	onRemove?: () => void;
	onEdit?: () => void;
};

export function Item({ product, count, onAdd, onRemove, onEdit }: Props) {
	const cardAmount = useHardwareStore((state) => state.cardAmount);

	return (
		<Paper>
			<Stack direction="row" spacing={2} alignItems="center" sx={{ p: 1 }}>
				<IconButton onClick={onEdit}>
					<EditIcon />
				</IconButton>
				<Box
					sx={{
						flex: 1,
					}}
				>
					<Typography variant="body1" fontWeight={500}>
						{product.name}
					</Typography>
					<Typography variant="body2">
						{product.price === product.originalPrice ? (
							`${product.price} kr`
						) : (
							<>
								<span
									style={{
										textDecoration: 'line-through',
										opacity: 0.6,
										marginRight: 8,
									}}
								>
									{product.originalPrice} kr
								</span>
								<span
									style={{
										marginRight: 8,
									}}
								>
									{product.price} kr
								</span>
								<span
									style={{
										marginRight: 8,
									}}
								>
									{getDiscountPercentage(product.originalPrice, product.price)}
								</span>
							</>
						)}
					</Typography>
				</Box>
				<Stack direction="row">
					<IconButton disabled={cardAmount == null} onClick={onRemove}>
						<RemoveIcon />
					</IconButton>
					<TextField
						variant="outlined"
						size="small"
						disabled
						sx={{
							width: 64,
						}}
						slotProps={{
							htmlInput: {
								sx: {
									textAlign: 'center',
								},
							},
						}}
						value={count ?? 0}
					/>
					<IconButton disabled={cardAmount == null} onClick={onAdd}>
						<AddIcon />
					</IconButton>
				</Stack>
			</Stack>
		</Paper>
	);
}
