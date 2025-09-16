import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	InputAdornment,
	Stack,
	TextField,
} from '@mui/material';
import { useId } from 'react';
import { useProductsStore } from '../productsStore';

export type Props = {
	productId?: string | null;
	onClose: () => void;
};

type FormFields = {
	name: string;
	originalPrice: string;
	price: string;
};

export default function EditProductDialog({ productId, onClose }: Props) {
	const formId = useId();

	const products = useProductsStore((state) => state.products);
	const updateProduct = useProductsStore((state) => state.updateProduct);
	const removeProduct = useProductsStore((state) => state.removeProduct);

	const product = products.find((p) => p.id === productId);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!productId) {
			return;
		}

		const formData = new FormData(event.currentTarget);
		const formJson = Object.fromEntries(formData.entries()) as FormFields;

		updateProduct({
			id: productId,
			name: formJson.name,
			price: Number.parseInt(formJson.price, 10),
		});

		onClose();
	};

	const handleDelete = () => {
		if (!productId) {
			return;
		}

		const ok = window.confirm('Är du säker på att du vill radera produkten?');
		if (!ok) {
			return;
		}

		removeProduct(productId);
		onClose();
	};

	return (
		<Dialog open={!!productId} onClose={onClose}>
			<DialogTitle>Redigera produkt</DialogTitle>
			<DialogContent>
				<form onSubmit={handleSubmit} id={formId}>
					<Stack spacing={2}>
						<TextField
							id={`${formId}-name`}
							name="name"
							autoFocus
							required
							margin="dense"
							label="Namn"
							type="text"
							fullWidth
							variant="standard"
							defaultValue={product?.name ?? ''}
						/>

						<Stack direction="row" spacing={2}>
							<TextField
								id={`${formId}-originalPrice`}
								name="originalPrice"
								required
								margin="dense"
								label="Originalpris"
								type="number"
								fullWidth
								variant="standard"
								defaultValue={product?.originalPrice ?? ''}
								slotProps={{
									input: {
										endAdornment: (
											<InputAdornment position="end">kr</InputAdornment>
										),
									},
									htmlInput: {
										min: 0,
									},
								}}
							/>

							<TextField
								id={`${formId}-price`}
								name="price"
								required
								margin="dense"
								label="Pris"
								type="number"
								fullWidth
								variant="standard"
								defaultValue={product?.price ?? ''}
								slotProps={{
									input: {
										endAdornment: (
											<InputAdornment position="end">kr</InputAdornment>
										),
									},
									htmlInput: {
										min: 0,
									},
								}}
							/>
						</Stack>
					</Stack>
				</form>
			</DialogContent>
			<DialogActions>
				<Button color="error" onClick={handleDelete}>
					Radera
				</Button>
				<Button onClick={onClose}>Avbryt</Button>
				<Button type="submit" form={formId}>
					Uppdatera
				</Button>
			</DialogActions>
		</Dialog>
	);
}
