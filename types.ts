export interface Specification {
  key: string;
  value: string;
}

export interface Variant {
  id: string;
  sku: string;
  diameter: string;
  length: string;
  finish: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  material: string;
  shortDescription: string;
  longDescription: string;
  sourcePage?: number;
  images: string[];
 
  specifications: Specification[];
  applications: string[];
  variants: Variant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Industry {
  name: string;
  iconName: string;
}