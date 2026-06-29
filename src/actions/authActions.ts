"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_TTL_MS,
  createAdminSessionToken,
  getConfiguredAdminPin,
} from "@/src/lib/adminSession";

export async function adminLogin(formData: FormData) {
  const pin = formData.get("pin")?.toString().trim();
  const configuredPin = getConfiguredAdminPin();

  // Support both ADMIN_SECRET_PIN (preferred) and ADMIN_PIN (legacy)
  if (pin && configuredPin && pin === configuredPin) {
    const expiresAt = Date.now() + ADMIN_SESSION_TTL_MS;
    const token = await createAdminSessionToken(expiresAt);
    const cookieStore = await cookies();

    cookieStore.set(ADMIN_SESSION_COOKIE_NAME, token, {
      expires: new Date(expiresAt),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    redirect("/admin");
  } else {
    redirect("/login?error=Invalid PIN");
  }
}

// --- LOGOUT ACTION (Add this) ---
export async function adminLogout() {
  const cookieStore = await cookies();
  
  // 1. Delete the cookie
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);

  // 2. Kick user back to login
  redirect("/login");
}
