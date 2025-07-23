import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="flex flex-col justify-center min-h-[calc(100vh-4rem)] p-6 text-center">
      <h1 className="text-4xl font-bold text-blue-400 leading-tight">
        Welcome back, {user?.name} !
      </h1>
    </div>
  );
}
