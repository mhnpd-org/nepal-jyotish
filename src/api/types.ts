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
  imageBase64?: string | null;  // profile image as base64 string
  description?: string;          // long bio/description
  languages?: string[];          // e.g. ["English", "Hindi", "Nepali"]
  ratingAvg?: number;            // average rating, e.g. 4.6
  ratingCount?: number;          // total number of ratings
  isActive?: boolean;            // whether astrologer is actively taking appointments
  availabilitySummary?: string;  // e.g. "Mon–Fri, 10am–6pm"
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
