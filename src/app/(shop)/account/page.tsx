"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { UserProfile } from "@/types/user";
import Title from "@/components/common/Title"; 


const Icons = {
  User: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Mail: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Phone: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Map: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Lock: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  X: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
};

interface ExtendedUserProfile extends UserProfile {
  phoneNumber?: string;
  phone?: string;
  address?: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  
  // State
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Feedback State
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch Profile Data
  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as ExtendedUserProfile;
        setProfile(data);
        
        setFormData({
          name: data.name || user.displayName || "",
          email: user.email || "",
          address: data.address || "",
          phoneNumber: data.phoneNumber || data.phone || "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError("");
    setSuccess("");

    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    try {
      setSaving(true);
      const updates: any = {};

      if (formData.name !== user.displayName) {
        await updateProfile(user, { displayName: formData.name });
        updates.name = formData.name;
      }

      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
        updates.email = formData.email;
      }

      if (formData.newPassword) {
        await updatePassword(user, formData.newPassword);
      }

      updates.address = formData.address;
      updates.phoneNumber = formData.phoneNumber;
      updates.phone = formData.phoneNumber;

      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, updates);

      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));

      await fetchProfile();
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      
      setTimeout(() => setSuccess(""), 5000);

    } catch (err: any) {
      console.error("Error updating profile:", err);
      if (err.code === 'auth/requires-recent-login') {
        setError("Security check: Please log out and log back in to change email or password.");
      } else {
        setError(err.message || "Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || user?.displayName || "",
        email: user?.email || "",
        address: profile.address || "",
        phoneNumber: profile.phoneNumber || profile.phone || "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "N/A";
    if (typeof dateValue.toDate === 'function') {
      return dateValue.toDate().toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
    return new Date(dateValue).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const Toast = () => (
    (error || success) ? (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md ${
            error ? "bg-red-50/90 border-red-200 text-red-800" : "bg-emerald-50/90 border-emerald-200 text-emerald-800"
          }`}>
             {error ? <Icons.X /> : <Icons.Check />}
             <span className="font-medium">{error || success}</span>
             <button onClick={() => { setError(""); setSuccess(""); }} className="opacity-60 hover:opacity-100 ml-2">
               <Icons.X />
             </button>
          </div>
        </div>
    ) : null
  );

  const InputGroup = ({ label, icon, children }: { label: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="space-y-2 group">
      <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
      <div className={`relative flex items-center transition-all duration-300 ${isEditing ? 'opacity-100' : 'opacity-90'}`}>
        <div className={`absolute left-4 ${isEditing ? 'text-blue-500' : 'text-gray-400'}`}>
          {icon}
        </div>
        {children}
      </div>
    </div>
  );

  // --- Loading State ---
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  // --- Auth Guard ---
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center max-w-sm">
           <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
             <Icons.Lock />
           </div>
          <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">Please log in to view your profile settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Toast />
      
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
           <div>
             <Title text1="ACCOUNT" text2="PROFILE" />
             <p className="text-slate-500 mt-2">Manage your account settings and preferences.</p>
           </div>
           
           {!isEditing && (
             <button
               onClick={() => setIsEditing(true)}
               className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md transition-all active:scale-95"
             >
               <Icons.Edit />
               <span>Edit Profile</span>
             </button>
           )}
        </div>

        {/* Main Card */}
        <form onSubmit={handleSubmit} className="rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 p-5">
          <div className="px-8">
            <div className="relative  mb-8 flex flex-col sm:flex-row items-end gap-6">
               <div className="relative">
                 <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-lg">
                   <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center text-2xl font-semibold text-blue-600 overflow-hidden">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                   </div>
                 </div>
                 {/* Online Status Dot */}
                 <div className="absolute bottom-2 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
               </div>
               
               <div className="flex-1 pb-2 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-slate-800">{formData.name || "User"}</h2>
                  <div className="flex flex-wrap gap-3 mt-2 justify-center sm:justify-start text-sm text-slate-500">
                     <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full font-medium">
                       {profile?.role || "Member"}
                     </span>
                     <span className="flex items-center gap-1">
                       Joined {profile ? formatDate(profile.createdAt) : "..."}
                     </span>
                  </div>
               </div>
            </div>

            <div className="space-y-10">
              <section className="animate-in slide-in-from-bottom-2 fade-in duration-500">
                 <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                    Personal Information
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <InputGroup label="Full Name" icon={<Icons.User />}>
                       <input 
                         type="text" 
                         name="name" 
                         value={formData.name} 
                         onChange={handleInputChange}
                         disabled={!isEditing}
                         className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all ${
                           isEditing 
                             ? "bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-900" 
                             : "bg-slate-50/50 border-transparent text-slate-600 cursor-default"
                         }`}
                         required 
                       />
                    </InputGroup>

                    <InputGroup label="Email Address" icon={<Icons.Mail />}>
                       <input 
                         type="email" 
                         name="email" 
                         value={formData.email} 
                         onChange={handleInputChange}
                         disabled={!isEditing}
                         className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all ${
                           isEditing 
                             ? "bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-900" 
                             : "bg-slate-50/50 border-transparent text-slate-600 cursor-default"
                         }`}
                         required 
                       />
                    </InputGroup>

                    <InputGroup label="Phone Number" icon={<Icons.Phone />}>
                       <input 
                         type="tel" 
                         name="phoneNumber" 
                         value={formData.phoneNumber} 
                         onChange={handleInputChange}
                         disabled={!isEditing}
                         placeholder="+1 (000) 000-0000"
                         className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all ${
                           isEditing 
                             ? "bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-900" 
                             : "bg-slate-50/50 border-transparent text-slate-600 cursor-default"
                         }`}
                       />
                    </InputGroup>

                    <div className="md:col-span-2">
                      <InputGroup label="Address" icon={<Icons.Map />}>
                        <textarea 
                          name="address" 
                          value={formData.address} 
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          rows={2}
                          placeholder="Your full address..."
                          className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all resize-none ${
                            isEditing 
                              ? "bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-900" 
                              : "bg-slate-50/50 border-transparent text-slate-600 cursor-default"
                          }`}
                        />
                      </InputGroup>
                    </div>
                 </div>
              </section>

              {/* Security Section - Only shows in edit mode */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isEditing ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <span className="text-purple-600"><Icons.Lock /></span>
                     Security Settings
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">New Password</label>
                        <input 
                          type="password" 
                          name="newPassword" 
                          value={formData.newPassword} 
                          onChange={handleInputChange}
                          placeholder="Min. 6 characters" 
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-white" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                        <input 
                          type="password" 
                          name="confirmPassword" 
                          value={formData.confirmPassword} 
                          onChange={handleInputChange}
                          placeholder="Confirm new password" 
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-white" 
                        />
                     </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">* Leave blank to keep your current password.</p>
                </section>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-6 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:scale-100"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}