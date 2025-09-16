export function getDiscountPercentage(originalPrice: number, price: number) {
	if (originalPrice <= 0) return 0;
	const percentage = Math.round(
		((originalPrice - price) / originalPrice) * 100,
	);

	if (percentage < 0) {
		return <span style={{ color: 'gray' }}>+{-percentage}%</span>;
	} else {
		return <span style={{ color: 'red' }}>-{percentage}%</span>;
	}
}
