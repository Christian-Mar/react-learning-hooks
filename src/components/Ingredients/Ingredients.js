import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  
	const [userIngredients, setUserIngredients] = useState([]);
	useEffect(() => {
		fetch(
			'https://react-learning-hooks-6c719-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json'
		) //fetch
			.then(response => response.json()) //get response
			.then(responseData => { 
				const loadedIngredients = []; //stuur de data naar een array
				for (const key in responseData) { //'for in' overloopt een object en gaat hier naar een array 
					loadedIngredients.push({
						id: key,
						title: responseData[key].title,
						amount: responseData[key].amount,
					});
				}
				setUserIngredients(loadedIngredients);
			});
	}, []); /* Zonder deze lege array komen we in een indefinite loop. Deze lege array geeft aan deze useEffect maar één keer mag gerendered worden. In de array kan een conditie gezet worden om aan te geven wanneerer kan gerendered worden. Leeg is hetzelfde als eenmaal, na de eerste render.  */

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]); // verandert enkel bij verandering userIngredients

	/* useEffect wordt uitgevoerd na het renderen van de component */

  const filteredIngredientsHandler = filteredIngredients => {
    setUserIngredients(filteredIngredients)
  }

	const addIngredientHandler = ingredient => {
		fetch(
			'https://react-learning-hooks-6c719-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
			/* achter de url door Firebase gegenereerd, ingredients.json toevoegen */
			{
				method: 'POST',
				body: JSON.stringify(ingredient),
				headers: { 'Content-Type': 'application/json' },
			}
		)
			.then(response => {
				return response.json();
			})
			.then(responseData => {
				setUserIngredients(prevIngredients => [
					...prevIngredients,
					{ id: responseData.name, ...ingredient },
				]);
			});
	};

	const removeIngredientHandler = ingredientId => {
		setUserIngredients(prevIngredients =>
			prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
		);
	};

	return (
		<div className='App'>
			<IngredientForm onAddIngredient={addIngredientHandler} />

			<section>
				<Search onLoadIngredients={filteredIngredientsHandler}/>
				<IngredientList
					ingredients={userIngredients}
					onRemoveItem={removeIngredientHandler}
				/>
			</section>
		</div>
	);
};

export default Ingredients;
