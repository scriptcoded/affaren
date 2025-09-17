import { produce } from 'immer';
import { v4 as uuid } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const sampleProducts: Product[] = [
	{ id: '1', name: 'Havregrynskrisp', originalPrice: 200, price: 200 },
	{ id: '2', name: 'Recept på äpplepaj', originalPrice: 20, price: 20 },
	{ id: '3', name: 'Äpple, kanel socker', originalPrice: 150, price: 150 },
	{ id: '4', name: 'Kniv och skärbräda', originalPrice: 100, price: 100 },
	{ id: '5', name: '3 spagettistrån', originalPrice: 10, price: 10 },
	{ id: '6', name: 'Trangiakök + gas', originalPrice: 80, price: 80 },
	{ id: '7', name: '3 tändstickor', originalPrice: 10, price: 10 },
	{ id: '8', name: '2 pinnar', originalPrice: 10, price: 10 },
	{ id: '9', name: '2 meter surrgarn', originalPrice: 20, price: 20 },
	{ id: '10', name: 'Sax', originalPrice: 20, price: 20 },

	{ id: '11', name: 'Råbandsknop', originalPrice: -10, price: -10 },
	{ id: '12', name: 'Dubbelt halvslag', originalPrice: -30, price: -30 },
	{ id: '13', name: 'Timmerstek', originalPrice: -30, price: -30 },
	{
		id: '14',
		name: 'Råbandsknop på spagetti',
		originalPrice: -150,
		price: -150,
	},
	{
		id: '15',
		name: 'Något som är exakt 47cm långt',
		originalPrice: -50,
		price: -50,
	},
	{
		id: '16',
		name: 'En dikt som innehåller ert patrullnamn',
		originalPrice: -75,
		price: -75,
	},
	{
		id: '17',
		name: 'Korrekt vinkelsurrning',
		originalPrice: -100,
		price: -100,
	},
	{
		id: '18',
		name: 'Något som är grått och rektangulärt',
		originalPrice: -20,
		price: -20,
	},
	{
		id: '19',
		name: 'Tänd tändsticka som brinner i minst 7 sekunder',
		originalPrice: -20,
		price: -20,
	},
	{ id: '20', name: 'Tändsticka', originalPrice: -10, price: -10 },
	{ id: '21', name: 'Häst', originalPrice: -30, price: -30 },
	{ id: '22', name: '10 armhävningar i rad', originalPrice: -10, price: -10 },
	{
		id: '23',
		name: 'En fläta som är minst 20 cm',
		originalPrice: -20,
		price: -20,
	},
	{
		id: '24',
		name: 'Korrekt utförd uppställningsutmaning',
		originalPrice: -40,
		price: -40,
	},
	{
		id: '25',
		name: 'Korrekt svar på frågepapper (per svar)',
		originalPrice: -10,
		price: -10,
	},
	{ id: '26', name: 'Löst chiffer', originalPrice: -50, price: -50 },
];

export type Product = {
	id: string;
	name: string;
	originalPrice: number;
	price: number;
};

export type ProductsStore = {
	products: Product[];
	setProduct: (product: Product) => void;
	addProduct: () => void;
	updateProduct: (product: Partial<Product>) => void;
	removeProduct: (productId: string) => void;
	seedProducts: () => void;
};

export const useProductsStore = create<ProductsStore>()(
	persist(
		(set, get) => ({
			products: [],
			setProduct: (product) => {
				set({
					products: produce(get().products, (draft) => {
						const existingIndex = draft.findIndex((p) => p.id === product.id);
						if (existingIndex !== -1) {
							draft[existingIndex] = product;
						} else {
							draft.push(product);
						}
					}),
				});
			},
			addProduct: () => {
				const newProduct: Product = {
					id: uuid(),
					name: 'Ny produkt',
					originalPrice: 100,
					price: 100,
				};
				set({
					products: produce(get().products, (draft) => {
						draft.push(newProduct);
					}),
				});
			},
			updateProduct: (product) => {
				set({
					products: produce(get().products, (draft) => {
						const existing = draft.find((p) => p.id === product.id);
						if (existing) {
							Object.assign(existing, product);
						}
					}),
				});
			},
			removeProduct: (productId: string) =>
				set({
					products: produce(get().products, (draft) => {
						const index = draft.findIndex((p) => p.id === productId);
						if (index !== -1) {
							draft.splice(index, 1);
						}
					}),
				}),
			seedProducts: () => {
				set({ products: sampleProducts });
			},
		}),
		{
			name: 'products-storage',
		},
	),
);
