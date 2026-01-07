import { IdentityProvider } from "@/components/providers/IdentityProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <IdentityProvider>
      {children}
    </IdentityProvider>
  );
}