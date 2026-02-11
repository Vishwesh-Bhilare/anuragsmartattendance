"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

interface RoleGuardProps {
  allowedRole: "student" | "faculty" | "admin";
  children: React.ReactNode;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RoleGuard({
  allowedRole,
  children,
}: RoleGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) {
        router.replace("/login");
        return;
      }

      if (profile.role !== allowedRole) {
        router.replace("/dashboard");
        return;
      }

      setAuthorized(true);
    };

    checkRole();
  }, [allowedRole, router]);

  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Checking access...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}

