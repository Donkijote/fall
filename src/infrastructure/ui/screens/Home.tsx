import { Badge } from "@/components/ui/badge";
import { WelcomeModal } from "@/infrastructure/ui/components/modal/WelcomeModal";
import { BottomNavbar } from "@/infrastructure/ui/components/navbar/BottomNavbar";

export const HomeScreen = () => (
  <main className="h-dvh overflow-y-auto bg-background text-foreground">
    <div className="flex min-h-full flex-col items-center justify-center gap-6 px-6 pt-8 pb-28">
      <Badge variant="secondary">Modern Edition</Badge>
      <header className="max-w-xl space-y-4 text-center">
        <h1 className="font-heading text-6xl font-bold text-primary sm:text-8xl">The Fall</h1>
        <p className="text-lg text-muted-foreground">
          A classic Venezuelan card game. Choose your mode and be the first to reach 24 points.
        </p>
      </header>
    </div>
    <BottomNavbar />
    <WelcomeModal />
  </main>
);
