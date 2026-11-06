import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RULES } from "@/domain/constants/rules";

import { SectionAccordion } from "./components/Accordion";
import { HintModal } from "./components/HintModal";
import { QuickRef } from "./components/QuickRef";
import { SingsGrid } from "./components/Sings";

export const RulesScreen = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(RULES.sections[0]?.id ?? "overview");

  return (
    <main className="h-dvh overflow-y-auto bg-background text-foreground">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              aria-label="Go back"
              className="goBack"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft />
            </Button>
            <div>
              <h1 className="font-heading text-2xl font-semibold">{RULES.hero.title}</h1>
              <p className="mt-1 text-muted-foreground">{RULES.hero.subtitle}</p>
            </div>
          </div>
          <Badge variant="secondary" className="hidden md:inline-flex">
            How to use
          </Badge>
        </header>
        <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
          <Tabs value={tab} onValueChange={(value) => setTab(String(value))} className="min-w-0">
            <TabsList
              aria-label="Rules sections"
              className="w-full flex-wrap group-data-horizontal/tabs:h-auto"
            >
              {RULES.sections.map((section) => (
                <TabsTrigger key={section.id} value={section.id}>
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {RULES.sections.map((section) => (
              <TabsContent
                key={section.id}
                value={section.id}
                keepMounted
                className="space-y-4 pt-3"
              >
                <SectionAccordion items={section.items} />
                {section.id === "sings" && <SingsGrid content={RULES} />}
              </TabsContent>
            ))}
          </Tabs>
          <QuickRef content={RULES} />
        </div>
      </div>
      <HintModal />
    </main>
  );
};
