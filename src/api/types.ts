export type Role = 'user' | 'astrologer' | 'super_admin';

export type AppUser = {
  uid: string;
  name?: string;
  email?: string;
  role?: Role;
  createdAt?: any;
  [k: string]: any;
};

export type Astrologer = {
  uid: string;
  name?: string;
  specialty?: string[];
  bio?: string;
  verified?: boolean;
  availability?: string[];
  [k: string]: any;
};

export type Appointment = {
  id?: string;
  userId: string;
  astrologerId: string;
  datetime: string;
  status: 'pending' | 'confirmed' | 'completed';
  callRoomId?: string;
  [k: string]: any;
};
