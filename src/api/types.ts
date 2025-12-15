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

export type AppointmentComment = {
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
};

export type Appointment = {
  id?: string;
  userId: string;
  astrologerId: string;

  // User details from form
  userName: string;
  userEmail: string;
  userPhone: string;
  userLocation: string;

  // Service details
  serviceType: string;  // service ID
  message: string;      // user's message/requirements

  // Scheduling (Nepal Time)
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm (24hr format, Nepal Time)
  duration: number;      // minutes (default 60)

  // Status and meeting
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;  // Jitsi meet URL

  // Comments/chat
  comments?: AppointmentComment[];

  // Metadata
  createdAt?: any;
  updatedAt?: any;

  [k: string]: any;
};
