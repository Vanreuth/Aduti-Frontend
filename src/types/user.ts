export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  name?: string;
  address?: string;
  phone?: string;
  photoURL?: string;
  role: "customer" | "admin" | "editor";
  createdAt: Date;
  status?: "Active" | "Inactive";
  bio: string;
}
export interface UserSettings {
  emailNotifications: boolean;
  orderUpdates: boolean;
  newsletter: boolean;
}

