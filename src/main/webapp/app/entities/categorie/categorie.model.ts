import dayjs from 'dayjs/esm';

export interface ICategorie {
  id: number;
  title?: string | null;
  description?: string | null;
  creationDate?: dayjs.Dayjs | null;
}

export type NewCategorie = Omit<ICategorie, 'id'> & { id: null };
