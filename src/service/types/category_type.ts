export type Category = {
  id: number;
  type: 'INCOME' | 'EXPENSE';
  name: string;
  ownerId: number;
};
