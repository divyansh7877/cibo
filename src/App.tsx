import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { AuthScreen } from "./components/Auth/AuthScreen";
import { Dashboard } from "./components/Dashboard/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SignedOut>
        <AuthScreen />
      </SignedOut>
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </div>
  );
}
