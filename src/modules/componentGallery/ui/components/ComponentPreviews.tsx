import { Settings } from "lucide-react";

import tavern from "@/assets/lobby/card-hall/tavern.webp";
import {
  ActionButton,
  ActivityCard,
  ChoiceButton,
  FramedCard,
  ModalContent,
  PopoverPanel,
  SelectField,
} from "@/components";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup } from "@/components/ui/toggle-group";

export function ActionPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ActionButton tone="primary">Primary</ActionButton>
      <ActionButton tone="quiet">Quiet</ActionButton>
      <ActionButton tone="outline">Outline</ActionButton>
      <ActionButton tone="outline" iconOnly aria-label="Settings">
        <Settings aria-hidden="true" />
      </ActionButton>
      <ActionButton tone="primary" disabled>
        Disabled
      </ActionButton>
    </div>
  );
}

export function ChoicePreview() {
  return (
    <ToggleGroup aria-label="Game format" defaultValue={["solo"]} className="flex flex-wrap gap-2">
      <ChoiceButton value="solo">Solo</ChoiceButton>
      <ChoiceButton value="teams">Teams</ChoiceButton>
      <ChoiceButton value="online" disabled>
        Online
      </ChoiceButton>
    </ToggleGroup>
  );
}

export function SelectPreview() {
  return (
    <SelectField
      options={[
        { value: "solo", label: "Solo" },
        { value: "teams", label: "Teams" },
      ]}
      defaultValue="solo"
      triggerProps={{ "aria-label": "Game format" }}
    />
  );
}

export function ActivityPreview() {
  const artwork = { imageUrl: tavern, imageWidth: 374, imageHeight: 386 };
  return (
    <div className="grid max-w-xs grid-cols-2 gap-3">
      <ActivityCard {...artwork} title="Tavern" selected />
      <ActivityCard {...artwork} title="Tavern" caption="Unavailable" unavailable disabled />
    </div>
  );
}

export function FramePreview() {
  return (
    <FramedCard>
      <CardHeader>
        <CardTitle className="title-type font-normal">Tavern match</CardTitle>
      </CardHeader>
      <CardContent>Choose a format before taking a seat.</CardContent>
      <CardFooter>
        <ActionButton tone="primary">Choose format</ActionButton>
      </CardFooter>
    </FramedCard>
  );
}

export function ModalPreview() {
  return (
    <Dialog>
      <DialogTrigger render={<ActionButton tone="outline" />}>Open dialog</DialogTrigger>
      <ModalContent>
        <DialogTitle className="text-xl font-normal">Tavern match</DialogTitle>
        <DialogDescription>Choose a format before taking a seat.</DialogDescription>
      </ModalContent>
    </Dialog>
  );
}

export function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger render={<ActionButton tone="outline" />}>Open help</PopoverTrigger>
      <PopoverPanel>
        <PopoverTitle className="title-type font-normal">Hall help</PopoverTitle>Find the rules and
        scoring reference here.
      </PopoverPanel>
    </Popover>
  );
}
