export function getDiscountPercentage(originalPrice: number, price: number) {
	const percentage = Math.round(
		((originalPrice - price) / originalPrice) * 100,
	);

	if (percentage < 0) {
		return <span style={{ color: 'gray' }}>+{-percentage}%</span>;
	} else {
		return <span style={{ color: 'red' }}>-{percentage}%</span>;
	}
}

export function getSalesPercentage(originalPrice: number, price: number) {
	const percentage = Math.round(
		((originalPrice - price) / originalPrice) * 100,
	);

	if (percentage < 0) {
		return <span style={{ color: 'green' }}>+{-percentage}%</span>;
	} else {
		return <span style={{ color: 'red' }}>-{percentage}%</span>;
	}
}
