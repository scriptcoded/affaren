import {
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { useFetchState } from './syncState';
import { getDiscountPercentage, getSalesPercentage } from './utils';

export function DisplayApp() {
	const products = useFetchState(2 * 1000);

	const sellableProducts = products.filter((p) => p.price > 0);
	const buyableProducts = products.filter((p) => p.price <= 0);

	return (
		<Grid container sx={{ p: 2 }} spacing={2}>
			<Grid size={6}>
				<Typography variant="h5" gutterBottom textAlign="center">
					Köpa
				</Typography>

				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Produkt</TableCell>
								<TableCell>Pris</TableCell>
								<TableCell>Rabatt</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{sellableProducts?.map((product) => {
								const isDiscounted = product.price !== product.originalPrice;

								return (
									<TableRow key={product.id}>
										<TableCell>{product.name}</TableCell>
										<TableCell>
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
												</>
											)}
										</TableCell>
										<TableCell>
											{isDiscounted && (
												<div style={{ display: 'inline-block', scale: 1.5 }}>
													{isDiscounted &&
														getDiscountPercentage(
															product.originalPrice,
															product.price,
														)}
												</div>
											)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
			<Grid size={6}>
				<Typography variant="h5" gutterBottom textAlign="center">
					Sälja
				</Typography>

				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Produkt</TableCell>
								<TableCell>Pris</TableCell>
								<TableCell>Prisförändring</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{buyableProducts?.map((product) => {
								const isDiscounted = product.price !== product.originalPrice;

								return (
									<TableRow key={product.id}>
										<TableCell>{product.name}</TableCell>
										<TableCell>
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
														{-product.originalPrice} kr
													</span>
													<span
														style={{
															marginRight: 8,
														}}
													>
														{-product.price} kr
													</span>
												</>
											)}
										</TableCell>
										<TableCell>
											{isDiscounted && (
												<div style={{ display: 'inline-block', scale: 1.5 }}>
													{isDiscounted &&
														getSalesPercentage(
															product.originalPrice,
															product.price,
														)}
												</div>
											)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</Grid>
	);

	// return (
	// 	<Grid container style={{ padding: 16 }} spacing={2}>
	// 		{products?.map((product) => {
	// 			const isDiscounted = product.price !== product.originalPrice;

	// 			return (
	// 				<Grid size={3} key={product.id}>
	// 					<Paper style={{ padding: 16 }}>
	// 						<Typography variant="h6">{product.name}</Typography>
	// 						<Grid container>
	// 							<Grid
	// 								size={6}
	// 								sx={{
	// 									height: 100,
	// 								}}
	// 							>
	// 								<Typography variant="subtitle1">
	// 									{product.price} kr
	// 								</Typography>
	// 								{isDiscounted && (
	// 									<Typography
	// 										variant="subtitle2"
	// 										sx={{ textDecoration: 'line-through' }}
	// 									>
	// 										{product.price} kr
	// 									</Typography>
	// 								)}
	// 							</Grid>
	// 							<Grid size={6}>
	// 								{isDiscounted && (
	// 									<Typography variant="subtitle2" align="right">
	// 										{getDiscountPercentage(
	// 											product.originalPrice,
	// 											product.price,
	// 										)}
	// 									</Typography>
	// 								)}
	// 							</Grid>
	// 						</Grid>
	// 					</Paper>
	// 				</Grid>
	// 			);
	// 		})}
	// 	</Grid>
	// );
}
