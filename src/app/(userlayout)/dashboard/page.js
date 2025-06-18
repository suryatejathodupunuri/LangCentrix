'use client';

import CONFIG from "../../../../config";

export default function DashboardPage() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-blue-400 leading-tight">
        Welcome to {CONFIG.APP_NAME} Dashboard
      </h1>
    </div>
  );
}
