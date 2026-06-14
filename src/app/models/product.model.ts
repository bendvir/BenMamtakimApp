export interface Product {
  id: number;
  title: string;
  price: number;
  priceType: 0 | 1; // 0 = kg-based, 1 = unit-based
  link: string;
  subCategoryPic?: string;
  amount?: number;
  pricePerUnit?: number;
  category?: string;
  description?: string;
  isNew?: boolean;
  inStock?: boolean;
}

export interface CartItem extends Product {
  amount: number;
  pricePerUnit: number;
}
