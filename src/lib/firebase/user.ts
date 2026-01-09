import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import { UserProfile } from "@/types/user";

function parseDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value && typeof (value as { toDate?: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate();
  }
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date();
}

function normalizeUserProfile(
  id: string,
  data: Record<string, unknown>
): UserProfile {
  const displayName =
    (data.displayName as string) ?? (data.name as string) ?? "";
  const name =
    (data.name as string) ?? (data.displayName as string) ?? undefined;

  return {
    uid: (data.uid as string) ?? id,
    email: (data.email as string) ?? "",
    displayName,
    name,
    address: data.address as string | undefined,
    phone: data.phone as string | undefined,
    photoURL: data.photoURL as string | undefined,
    role: (data.role as UserProfile["role"]) ?? "customer",
    createdAt: parseDate(data.createdAt),
    status: (data.status as UserProfile["status"]) ?? "Active",
    bio: (data.bio as string) ?? "",
  };
}

export async function createUserProfile(profile: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, "users", profile.uid);
    await setDoc(
      userRef,
      {
        ...profile,
        createdAt: profile.createdAt ?? new Date(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    const cleanUpdates: Record<string, unknown> = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    });

    if (Object.keys(cleanUpdates).length === 0) {
      return;
    }

    await updateDoc(userRef, cleanUpdates);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export async function deleteUserProfile(uid: string): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting user profile:", error);
    throw error;
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      return null;
    }
    return normalizeUserProfile(snap.id, snap.data() as Record<string, unknown>);
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export async function listUsers(maxUsers = 50): Promise<UserProfile[]> {
  try {
    const q = query(
      collection(db, "users"),
      orderBy("createdAt", "desc"),
      limit(maxUsers)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) =>
      normalizeUserProfile(docSnap.id, docSnap.data() as Record<string, unknown>)
    );
  } catch (error) {
    console.error("Error listing users:", error);
    return [];
  }
}
