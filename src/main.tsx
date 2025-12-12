import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import "./index.css";
import App from "./App";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const clerkAppearance = {
  variables: {
    colorPrimary: "#f97316",
    colorText: "#1e293b",
    colorTextSecondary: "#64748b",
    colorBackground: "#ffffff",
    colorInputBackground: "#f8fafc",
    colorInputText: "#1e293b",
    borderRadius: "0.75rem",
    fontFamily: "inherit",
  },
  elements: {
    card: "shadow-lg border border-slate-200",
    headerTitle: "text-slate-800 font-bold",
    headerSubtitle: "text-slate-500",
    socialButtonsBlockButton: "border-slate-200 hover:bg-slate-50 text-slate-700",
    formButtonPrimary: "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md",
    formFieldLabel: "text-slate-700 font-medium",
    formFieldInput: "border-slate-200 focus:border-orange-400 focus:ring-orange-400",
    footerActionLink: "text-orange-500 hover:text-orange-600",
    identityPreviewEditButton: "text-orange-500 hover:text-orange-600",
    formFieldInputShowPasswordButton: "text-slate-400 hover:text-slate-600",
    dividerLine: "bg-slate-200",
    dividerText: "text-slate-400",
    modalBackdrop: "bg-slate-900/50 backdrop-blur-sm",
    modalContent: "shadow-2xl",
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}
      appearance={clerkAppearance}
    >
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </ClerkProvider>
  </StrictMode>
);
