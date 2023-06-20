import dayjs from 'dayjs/esm';

import { IComment, NewComment } from './comment.model';

export const sampleWithRequiredData: IComment = {
  id: 77711,
};

export const sampleWithPartialData: IComment = {
  id: 6238,
  comment: 'energize deposit maximized',
};

export const sampleWithFullData: IComment = {
  id: 39431,
  comment: 'minus Cis AI',
  date: dayjs('2023-06-20T06:46'),
};

export const sampleWithNewData: NewComment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
