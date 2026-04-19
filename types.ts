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
 