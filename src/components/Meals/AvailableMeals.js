import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';
import { useEffect, useState } from 'react';

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();

  useEffect(() => {
    // response
    const fetchMeals = async () => {
      const res = await fetch('https://react-http-a33ab-default-rtdb.firebaseio.com/meals.json');

      if (!res.ok) {
        throw new Error(`Something went wrong - ${ res.status }!!!`);
      }

      const resData = await res.json();

      const loadedMeals = [];
      for (const key in resData) {
        loadedMeals.push({
          id: key,
          name: resData[key].name,
          description: resData[key].description,
          price: resData[key].price
        });
      }

      // show preloader or our card
      setMeals(loadedMeals);
      setIsLoading(false);
    };

    // start
    fetchMeals().catch(error => {
      setIsLoading(false);
      setHttpError(error.message);
    });

  }, []);

  const mealsList = meals.map((meal) => (
    <MealItem
      key={ meal.id }
      { ...meal }
    />
  ));

  // preload
  if (isLoading) {
    return (
      <section className={ classes.MealsLoading }>
        <p>Loading ...</p>
      </section>
    );
  }

  // error
  if (httpError) {
    return (
      <section className={ classes.MealsError }>
        <p>{ httpError }</p>
      </section>
    );
  }

  return (
    <section className={ classes.meals }>
      <Card>
        <ul>{ mealsList }</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
