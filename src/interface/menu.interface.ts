

export interface CreateMenuInput {
    dishName: string;
    description: string;
    price: number;
    category: string;
    ingredients: string;
    allergenInfo: string;
    status: string;
    image?: string;
    servingTimes?: string;
    addOns?: string;
  }
  
  export interface UpdateMenuInput {
    dishName?: string;
    description?: string;
    price?: number;
    category?: string;
    ingredients?: string;
    allergenInfo?: string;
    status?: string;
    image?: string;
    servingTimes?: string;
    addOns?: string;
  }
  