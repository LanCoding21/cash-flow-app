import { Category } from './category_type';

export type DailySummarizeTransaction = {
  date: string;
  type: string;
  amount: number;
  category: string;
};

export type Transaction = {
  id: number;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  categoryId: number;
  amount: number;
  receiptFile?: string;
  createdBy: string;
  createdAt: string;
  category: Category;
};
