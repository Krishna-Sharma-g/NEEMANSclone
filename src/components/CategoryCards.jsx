import React from 'react';
import './CategoryCards.css';
import { Link, useNavigate } from 'react-router-dom';

const categories = [
	{
		label: 'SNEAKERS',
		image: 'https://neemans.com/cdn/shop/files/Frame_39230_ab7ae17e-7d4e-41f9-8f32-17e555ad43f4.png?v=1712729212&width=400',
		handle: 'sneakers',
		bgtext: 'SNEAKERS',
	},
	{
		label: 'SLIP-ONS',
		image: 'https://neemans.com/cdn/shop/files/Frame_39231_9d230ddc-a0bd-445e-89e8-c64c2c47d688.png?v=1712729212&width=400',
		handle: 'slip-ons',
		bgtext: 'SLIP ONS',
	},
	{
		label: 'LOAFERS',
		image: 'https://neemans.com/cdn/shop/files/Frame_39233_d9666860-0b4a-4988-a4f6-0c508f84a258.png?v=1712583768&width=400',
		handle: 'loafers',
		bgtext: 'LOAFERS',
	},
	{
		label: 'OXFORDS',
		image: 'https://neemans.com/cdn/shop/files/Oxfords.png?v=1720616110&width=400',
		handle: 'oxfords-collection',
		bgtext: 'OXFORDS',
	},
	{
		label: 'FLATS',
		image: 'https://neemans.com/cdn/shop/files/Flats_New.png?v=1718002963&width=400',
		handle: 'flats',
		bgtext: 'FLATS',
	},
	{
		label: 'SANDALS',
		image: 'https://neemans.com/cdn/shop/files/Frame_39234_850d0a30-849f-46cd-ade8-e812eeadffda.png?v=1712583768&width=400',
		handle: 'sandals',
		bgtext: 'SANDALS',
	},
	{
		label: 'SLIDES',
		image: 'https://neemans.com/cdn/shop/files/Slides.png?v=1730268638&width=400',
		handle: 'slides',
		bgtext: 'SLIDES',
	},
	{
		label: 'WALKING SHOES',
		image: 'https://neemans.com/cdn/shop/files/Frame_39236_344486a2-12a4-4418-9470-9dba384503fa.png?v=1712583768&width=400',
		handle: 'walking-shoes',
		bgtext: 'WALKING',
	},
];

const CategoryCards = ({ onViewAll }) => {
	const firstRow = categories.slice(0, 4);
	const secondRow = categories.slice(4, 8);
	const navigate = useNavigate();

	const handleViewAll = () => {
		const handle = 'all-products';
		if (onViewAll) {
			onViewAll(handle);
		}
		navigate(`/collections/${handle}`);
	};

	return (
		<section className="category-cards-section">
			<h2 className="category-title">Explore our categories</h2>
			<div className="category-cards-row">
				{firstRow.map((cat, idx) => (
					<Link to={`/collections/${cat.handle}`} className="category-card" key={idx}>
						<div className="category-card-bgtext">{cat.bgtext}</div>
						<img src={cat.image} alt={cat.label} className="category-card-image" />
					</Link>
				))}
			</div>
			<div className="category-cards-row">
				{secondRow.map((cat, idx) => (
					<Link to={`/collections/${cat.handle}`} className="category-card" key={idx + 4}>
						<div className="category-card-bgtext">{cat.bgtext}</div>
						<img src={cat.image} alt={cat.label} className="category-card-image" />
					</Link>
				))}
			</div>
			<div className="view-all-container">
				<button className="view-all-btn" onClick={handleViewAll}>
					VIEW ALL PRODUCTS <span className="arrow">&rarr;</span>
				</button>
			</div>
		</section>
	);
};

export default CategoryCards;