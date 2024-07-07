import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  collection,
  addDoc,
  Timestamp,
  getFirestore,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';

const ProductForm = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const storage = getStorage();
  const firestore = getFirestore();

  const handleImageChange = e => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (image) {
      const storageRef = ref(storage, `Product/${image.name}`);
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      console.log('업로드된 이미지 경로', url);
      setImageUrl(url);
      return url;
    }
    return '';
  };

  const handleAddProduct = async e => {
    e.preventDefault();
    const url = await handleUploadImage();
    const productData = {
      productName,
      productPrice: parseFloat(productPrice),
      productQuantity: parseInt(productQuantity),
      productDescription,
      productCategory,
      imageUrl: url,
      createdAt: Timestamp.now(),
    };
    await addDoc(collection(firestore, 'Product'), productData);
    // 초기화
    setProductName('');
    setProductPrice('');
    setProductQuantity('');
    setProductDescription('');
    setImage(null);
    setImageUrl('');
  };

  return (
    <section className="bg-white dark:bg-gray-900 flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center w-full max-w-4xl p-4 overflow-y-auto max-h-screen">
        <div className="w-full mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            제품 이미지
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          />
          {image && <p className="mt-2 text-sm text-gray-500">{image.name}</p>}
        </div>
        <div className="w-full py-8 px-4 max-w-3xl lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            제품 등록
          </h2>
          <form onSubmit={handleAddProduct}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="ProductName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  제품 이름
                </label>
                <input
                  type="text"
                  id="ProductName"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product name"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="ProductPrice"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  제품 가격
                </label>
                <input
                  type="number"
                  id="ProductPrice"
                  value={productPrice}
                  onChange={e => setProductPrice(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
              <div>
                <label
                  htmlFor="ProductWeight"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  제품 수량
                </label>
                <input
                  type="number"
                  id="ProductWeight"
                  value={productQuantity}
                  onChange={e => setProductQuantity(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="12"
                />
              </div>
              <div>
                <label
                  htmlFor="productCategory"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  카테고리
                </label>
                <select
                  id="productCategory"
                  value={productCategory}
                  onChange={e => setProductCategory(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">카테고리 선택</option>
                  <option value="keyboard">커스텀키보드</option>
                  <option value="key">키보드 조각</option>
                  <option value="accessory">악세서리</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="ProductDescription"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  제품 설명
                </label>
                <textarea
                  id="ProductDescription"
                  value={productDescription}
                  onChange={e => setProductDescription(e.target.value)}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your description here"
                />
              </div>
            </div>
            <Button type="submit" className="py-2">
              제품 등록
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ProductForm;
