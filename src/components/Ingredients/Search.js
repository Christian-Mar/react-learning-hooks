import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
	const { onLoadIngredients } = props;
	const [enteredFilter, setEnteredFilter] = useState('');

	useEffect(() => {
		const query =
			enteredFilter.length === 0
				? ''
				: `?orderBy="title"&equalTo="${enteredFilter}"`;
		fetch(
			'https://react-learning-hooks-6c719-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json' + query
		) //fetch
			.then(response => response.json()) //get response
			.then(responseData => {
				const loadedIngredients = []; //stuur de data naar een array
				for (const key in responseData) {
					//'for in' overloopt een object en gaat hier naar een array
					loadedIngredients.push({
						id: key,
						title: responseData[key].title,
						amount: responseData[key].amount,
					});
				}
				onLoadIngredients(loadedIngredients);
			});
	}, [enteredFilter, onLoadIngredients]);

	return (
		<section className='search'>
			<Card>
				<div className='search-input'>
					<label>Filter by Title</label>
					<input
						type='text'
						value={enteredFilter}
						onChange={event => setEnteredFilter(event.target.value)}
					/>
				</div>
			</Card>
		</section>
	);
});

export default Search;
