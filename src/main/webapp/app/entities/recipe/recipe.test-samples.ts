import dayjs from 'dayjs/esm';

import { IRecipe, NewRecipe } from './recipe.model';

export const sampleWithRequiredData: IRecipe = {
  id: 42463,
};

export const sampleWithPartialData: IRecipe = {
  id: 41531,
  title: 'East Vatu North',
  cookingTime: 'integrate SAS',
  imageUrl: 'Shoes Adventure',
};

export const sampleWithFullData: IRecipe = {
  id: 48345,
  title: 'Tandem Avon',
  description: 'female Soul',
  cookingTime: 'Stefanie',
  rate: 98230,
  imageUrl: 'meter',
  creationDate: dayjs('2023-06-20T09:14'),
};

export const sampleWithNewData: NewRecipe = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
