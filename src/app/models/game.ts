export interface Game {
  id: string;
  name: string;
  stock: boolean;
  description: string;
  amount: number;
  currency: string;
  gameCover: string;
  genres: string[];
  images: string[];
  pegi: number;
  platform: string;
  releaseDate: string;
  system: string;
  trailer: string;
}
