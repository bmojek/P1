export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
}

export interface RegisterResponse {
  status: number;
  user?: User;
  message?: string;
}
export interface reviews {
  review_id: string;
  rating: number;
  name: string;
  reviewer_profile: string;
  review_text: string;
  published_at: string;
  published_at_date: string;
  response_from_owner_text: string | null;
  response_from_owner_ago: string | null;
  response_from_owner_date: string | null;
  review_likes_count: number;
  total_number_of_reviews_by_reviewer: number | null;
  total_number_of_photos_by_reviewer: number | null;
  is_local_guide: boolean;
  review_translated_text: string | null;
  response_from_owner_translated_text: string | null;
  review_photos: string[];
}
interface images {
  about: string;
  link: string;
}

export interface Place {
  id: string;
  name: string;
  image: string;
  location: string;
  locationCords?: { lat: number; lon: number };
  reviewCount: number;
  rating: string;
  type: string;
  tags: string[];
  desc: string | null;
  reviews?: reviews[];
  images?: images[];
}

export interface ApiContextType {
  users: User[];
  place: Place[];
  register: (
    login: string,
    password: string,
    email: string
  ) => Promise<RegisterResponse>;
  login: (login: string, password: string) => Promise<User | null>;
  getUserList: () => Promise<void>;
  fetchPlaces: () => Promise<void>;
}
