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
