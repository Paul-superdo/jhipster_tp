import dayjs from 'dayjs/esm';

import { ICategorie, NewCategorie } from './categorie.model';

export const sampleWithRequiredData: ICategorie = {
  id: 27058,
};

export const sampleWithPartialData: ICategorie = {
  id: 91286,
  description: 'migration',
};

export const sampleWithFullData: ICategorie = {
  id: 19686,
  title: 'Cab sievert',
  description: 'group Chicken',
  creationDate: dayjs('2023-06-19T20:50'),
};

export const sampleWithNewData: NewCategorie = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
