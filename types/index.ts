export interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  auction: {
    id: string;
    startTime: string;
    endTime: string;
    isClosed: boolean;
    winnerId: string | null; // Can be null if no winner yet
  };
  product: {
    id: string;
    title: string;
    description: string;
    startingPrice: number;
    status: string;
    sellerId: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
  };
  image: string;
}
