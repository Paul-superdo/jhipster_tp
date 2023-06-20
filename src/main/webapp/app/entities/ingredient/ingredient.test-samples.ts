import dayjs from 'dayjs/esm';

import { IIngredient, NewIngredient } from './ingredient.model';

export const sampleWithRequiredData: IIngredient = {
  id: 71316,
};

export const sampleWithPartialData: IIngredient = {
  id: 52550,
  name: 'Electronic',
  description: 'Classical',
  creationDate: dayjs('2023-06-20T03:31'),
};

export const sampleWithFullData: IIngredient = {
  id: 46529,
  name: 'Licensed',
  description: 'Bentley',
  portions: 17161,
  creationDate: dayjs('2023-06-20T07:17'),
};

export const sampleWithNewData: NewIngredient = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
