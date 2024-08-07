import React, { useEffect, useState } from 'react';
import { useFetchInfiniteProducts } from '@/hooks/UseFetchData';
import MainProductCard from '@/components/ui/MainProductCard';
import { useInView } from 'react-intersection-observer';
import { useProductCategory } from '@/components/context/ProductCategoryContext';
import { ProductCard } from '@/lib/utils';
import { useFetchSortedProducts } from '@/hooks/FetchSortedProducts';

const AllProductPage: React.FC = () => {
  const { category, setCategory } = useProductCategory();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchInfiniteProducts();
  const { ref, inView } = useInView();
  const [sortOption, setSortOption] = useState('productPrice');
  const {
    data: products,
    isLoading,
    error,
  } = useFetchSortedProducts(sortOption);
  const [sortedProducts, setSortedProducts] = useState<ProductCard[]>([]);

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (data) {
      const allProducts = data.pages.flatMap(page => page.products);
      const filteredProducts = category
        ? allProducts.filter(product => product.productCategory === category)
        : allProducts;

      const sortedArray = [...filteredProducts];
      if (sortOption === 'updatedAt') {
        sortedArray.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
      } else if (sortOption === 'productPrice') {
        sortedArray.sort((a, b) => b.productPrice - a.productPrice);
      }
      console.log('변경 후 sortArray의 상태', sortedArray);
      setSortedProducts(sortedArray);
    }
  }, [sortOption, data, category]);

  if (isLoading) {
    return <div>Loadinhg...</div>;
  }

  if (error) {
    return <div>에러 발생</div>;
  }

  console.log('현재 카테고리는?', category);
  const filteredProducts = category
    ? data?.pages?.flatMap(page =>
        page.products.filter(product => product.productCategory === category),
      ) || []
    : data?.pages?.flatMap(page => page.products) || [];

  const handleSortByPrice = () => {
    setSortOption('productPrice');
    console.log('지금 state상태는?;', sortOption);
  };

  const hanldeAllProduct = () => {
    setCategory(null);
  };
  return (
    <div className="p-20">
      <div>
        <h3 className="text-3xl">현재 {category}의 물품입니다</h3>

        <div className="flex">
          <button
            onClick={hanldeAllProduct}
            type="button"
            className="lg:hover:underline"
          >
            <h6>전체</h6>
          </button>
          <h6> &nbsp;/&nbsp; </h6>
          <button
            onClick={handleSortByPrice}
            type="button"
            className="lg:hover:underline"
          >
            가격순
          </button>
          <h6> &nbsp;/&nbsp; </h6>
          <button
            onClick={() => setSortOption('updatedAt')}
            className="lg:hover:underline"
            type="button"
          >
            날짜순
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-start">
        {sortedProducts.map(product => (
          <MainProductCard key={product.id} product={product} />
        ))}
        <div ref={ref} className="loading">
          {isFetchingNextPage && <p>Loading more products...</p>}
        </div>
      </div>
    </div>
  );
};

export default AllProductPage;
