import { Category } from './category';

export interface TableMeta<T> {
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}
