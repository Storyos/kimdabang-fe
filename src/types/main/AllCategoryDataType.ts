interface Category {
  id: number;
  name: string;
  parentId?: number;
}

export type OnlyMainCategory = Omit<Category, "parentId"> & {
  imgUrl: string;
};

// 전체 카테고리 데이터를 담을 타입 정의
export interface AllCategoryDataType {
  mainCategories: Category[]; // 대분류
  subCategories: Category[]; // 중분류
  detailCategories: Category[]; // 소분류
}
