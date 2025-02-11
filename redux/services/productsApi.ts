import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type ProductImage = {
    title: string;
    description: string;
    url: string;
  };
  
  export type Product = {
    id: number;
    name: string;
    description: string;
    ean: string;
    upc: string;
    image: string;
    images: ProductImage[];
    net_price: number;
    taxes: number;
    price: number;
    categories: number[];
    tags: string[];
  };
  

  export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://fakerapi.it/api/v2/' }),
    endpoints: (builder) => ({
      getProducts: builder.query<{ data: Product[] }, string | number>({
        query: (page) => 
          page === 'all' ? `products?_quantity=1000` : `products?_quantity=12&_page=${page}`,
      }),
    //   getProductById: builder.query<Product, number>({
    //     query: (id) => `products/${id}`,
    //   }),
    }),
  });
  
  export const { useGetProductsQuery } = productsApi;
