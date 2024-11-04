interface reviews {
  userId: string;
  topic: string;
  desc?: string;
  rate: number;
  date: Date;
  photos?: string[];
}

interface details {
  name: string;
  desc: string;
  reviews?: reviews[];
}

export interface Place {
  id: string;
  name: string;
  image: string;
  location: string;
  locationCords?: { lat: number; lon: number };
  reviewCount: number;
  rating: string | number;
  type: string;
  tags: string[];
  details?: details;
}
