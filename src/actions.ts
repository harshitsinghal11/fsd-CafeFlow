"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogin(formData: FormData) {
  const pin = formData.get("pin")?.toString().trim();
  const configuredPin = process.env.ADMIN_SECRET_PIN ?? process.env.ADMIN_PIN;

  // Support both ADMIN_SECRET_PIN (preferred) and ADMIN_PIN (legacy)
  if (pin && configuredPin && pin === configuredPin) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      path: "/",
    });

    redirect("/admin");
  } else {
    redirect("/admin/login?error=Invalid PIN");
  }
}

// --- LOGOUT ACTION (Add this) ---
export async function adminLogout() {
  const cookieStore = await cookies();
  
  // 1. Delete the cookie
  cookieStore.delete("admin_session");

  // 2. Kick user back to login
  redirect("/admin/login");
}
