import { Box, Stack, Typography } from '@mui/material';
import type { CartItem } from '../App';
import type { Product } from '../productsStore';
import { useHardwareStore } from '../hardwareStore';

export type Props = {
	cartItems: CartItem[];
	products: Product[];
	total: number;
	leftAfterPurchase: number | null;
};

export function Receipt({
	cartItems,
	products,
	total,
	leftAfterPurchase,
}: Props) {
	const cardAmount = useHardwareStore((state) => state.cardAmount);

	return (
		<Box>
			<Typography variant="h6" gutterBottom>
				Kvitto
			</Typography>

			<Stack spacing={1}>
				{cartItems.map((ci) => {
					const item = products.find((i) => i.id === ci.itemId);

					if (!item) {
						return null;
					}

					return (
						<Box key={ci.itemId}>
							{item?.name} x {ci.quantity}
							<span style={{ float: 'right' }}>
								{item.price * ci.quantity} kr
							</span>
						</Box>
					);
				})}
			</Stack>

			<Box sx={{ borderTop: '1px solid #ccc', mt: 2, pt: 1 }}>
				<Typography variant="body1" fontWeight={500}>
					Total
					<span style={{ float: 'right' }}>{total} kr</span>
				</Typography>
			</Box>

			<Box sx={{ borderTop: '1px solid #ccc', mt: 2, pt: 1 }}>
				<Typography variant="body1" fontWeight={500}>
					Mängd på kort
					<span style={{ float: 'right' }}>
						{cardAmount !== null ? `${cardAmount} kr` : '-'}
					</span>
				</Typography>
			</Box>

			<Box sx={{ borderTop: '1px solid #ccc', mt: 2, pt: 1 }}>
				<Typography variant="body1" fontWeight={500}>
					Kvar efter köp
					<span style={{ float: 'right' }}>
						{leftAfterPurchase !== null ? `${leftAfterPurchase} kr` : '-'}
					</span>
				</Typography>
			</Box>
		</Box>
	);
}
