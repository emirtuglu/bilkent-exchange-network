export interface User {
  name: string;
  bilkentId: string;
  photo: string;
  email: string;
  password: string;
}

export interface UserProfile {
  username: string;
  name: string;
  email: string;
  photo: string;
  reputation: number;
  bio: string;
  registerDate: string;
}
export interface FilterProps {
  type: string;
  passFilters: (params: FilterParams) => void;
}

export interface FilterParams {
  categories: string[];
  prices: {
    min: number | undefined;
    max: number | undefined;
  };
  dates: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  status: string;
}
