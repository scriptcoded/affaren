import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import EditProductDialog from './components/EditProductDialog';
import { HardwareBar } from './components/HardwareBar';
import { Item } from './components/Item';
import { Receipt } from './components/Receipt';
import { useHardwareStore } from './hardwareStore';
import { useProductsStore } from './productsStore';
import { useStateSync } from './syncState';

export type CartItem = {
	itemId: string;
	quantity: number;
};

export function SellerApp() {
	const products = useProductsStore((state) => state.products);
	const addProduct = useProductsStore((state) => state.addProduct);
	const seedProducts = useProductsStore((state) => state.seedProducts);
	const port = useHardwareStore((state) => state.port);
	const cardAmount = useHardwareStore((state) => state.cardAmount);
	const sendEject = useHardwareStore((state) => state.sendEject);
	const sendSetPrice = useHardwareStore((state) => state.sendSetPrice);
	const sendWriteAmount = useHardwareStore((state) => state.sendWriteAmount);

	const sellableProducts = products.filter((p) => p.price > 0);
	const buyableProducts = products.filter((p) => p.price <= 0);

	const [editedProductId, setEditedProductId] = useState<string | null>(null);

	const [cartItems, setCartItems] = useState<CartItem[]>([]);

	useStateSync(products);

	const cartTotal = cartItems.reduce((total, ci) => {
		const item = products.find((i) => i.id === ci.itemId);
		if (!item) {
			return total;
		}
		return total + item.price * ci.quantity;
	}, 0);

	useEffect(() => {
		sendSetPrice(cartTotal);
	}, [cartTotal, sendSetPrice]);

	const leftAfterPurchase = cardAmount !== null ? cardAmount - cartTotal : null;

	const getItemCount = (itemId: string) => {
		const cartItem = cartItems.find((ci) => ci.itemId === itemId);
		return cartItem ? cartItem.quantity : 0;
	};

	const changeItemCount = (itemId: string, delta: number) => {
		setCartItems((currentCartItems) => {
			const existingItem = currentCartItems.find((ci) => ci.itemId === itemId);
			if (existingItem) {
				const newQuantity = existingItem.quantity + delta;
				if (newQuantity <= 0) {
					return currentCartItems.filter((ci) => ci.itemId !== itemId);
				} else {
					return currentCartItems.map((ci) =>
						ci.itemId === itemId ? { ...ci, quantity: newQuantity } : ci,
					);
				}
			} else {
				if (delta <= 0) {
					return currentCartItems;
				} else {
					return [...currentCartItems, { itemId, quantity: delta }];
				}
			}
		});
	};

	const addItemToCart = (itemId: string) => {
		changeItemCount(itemId, 1);
	};

	const removeItemFromCart = (itemId: string) => {
		changeItemCount(itemId, -1);
	};

	const cancel = () => {
		setCartItems([]);
		sendEject();
	};

	const pay = () => {
		if (!leftAfterPurchase || leftAfterPurchase < 0) {
			return;
		}

		sendWriteAmount(leftAfterPurchase);
		setCartItems([]);
	};

	return (
		<>
			<Stack
				sx={{
					height: '100vh',
				}}
			>
				<HardwareBar />

				<Grid
					container
					direction="row"
					sx={{
						padding: 2,
						flex: 1,
						minHeight: 0,
					}}
					spacing={6}
				>
					<Grid size={6} sx={{ height: '100%', overflowY: 'auto' }}>
						<Typography variant="h5" gutterBottom textAlign="center">
							Till försäljning
						</Typography>

						<Stack spacing={2}>
							{sellableProducts.map((product) => (
								<Item
									key={product.id}
									product={product}
									count={getItemCount(product.id)}
									onAdd={() => addItemToCart(product.id)}
									onRemove={() => removeItemFromCart(product.id)}
									onEdit={() => setEditedProductId(product.id)}
								/>
							))}

							<Typography variant="h5" gutterBottom textAlign="center">
								Att sälja
							</Typography>

							{buyableProducts.map((product) => (
								<Item
									key={product.id}
									product={product}
									count={getItemCount(product.id)}
									onAdd={() => addItemToCart(product.id)}
									onRemove={() => removeItemFromCart(product.id)}
									onEdit={() => setEditedProductId(product.id)}
								/>
							))}

							{products.length === 0 ? (
								<Stack alignItems="center" spacing={2}>
									<Button variant="contained" onClick={seedProducts}>
										Skapa standardprodukter
									</Button>
								</Stack>
							) : (
								<Button variant="contained" onClick={addProduct}>
									Lägg till produkt
								</Button>
							)}
						</Stack>
					</Grid>
					<Grid size={6} sx={{ height: '100%', overflowY: 'auto' }}>
						<Stack sx={{ height: '100%' }}>
							<Box flex={1}>
								<Receipt
									cartItems={cartItems}
									products={products}
									total={cartTotal}
									leftAfterPurchase={leftAfterPurchase}
								/>
							</Box>

							<Stack
								direction="row"
								spacing={2}
								justifyContent="flex-end"
								mt={2}
							>
								<Button size="large" onClick={cancel}>
									Avbryt
								</Button>
								<Button
									size="large"
									variant="contained"
									disabled={
										!port ||
										cartTotal <= 0 ||
										cardAmount === null ||
										cardAmount < cartTotal
									}
									onClick={pay}
								>
									Betala
								</Button>
							</Stack>
						</Stack>
					</Grid>
				</Grid>
			</Stack>

			<EditProductDialog
				productId={editedProductId}
				onClose={() => setEditedProductId(null)}
			/>
		</>
	);
}
