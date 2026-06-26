export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface CurrentUser {
  user: {
    userId: number;
    iat: number;
    exp: number;
    username?: string;
    full_name?: string;
  };
}

export interface User {
  id: number;
  username: string;
  full_name: string;
  profile_image: string;
}

export interface UserProfile {
  profile: {
    name: string;
    username: string;
    bio: string;
    profilePicture: string;
    offeredSkills: string[];
    requiredSkills: string[];
    stats: {
      availableTimeCredits: number;
      servicesProvided: number;
      servicesReceived: number;
    };
    trustRating: {
      average: number;
      count: number;
    };
    recentExchanges: {
      id: number;
      role: "PROVIDER" | "RECEIVER";
      timeCredits: number;
      completedAt: string;
      post: {
        id: number;
        title: string;
      };
      counterparty: {
        id: number;
        username: string;
        name: string;
        profilePicture: string;
      };
    }[];
  };
}
