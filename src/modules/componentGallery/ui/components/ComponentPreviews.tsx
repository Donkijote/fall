import { Settings } from "lucide-react";

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
import { homeActivities } from "@/modules/home";

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
  return (
    <div className="grid gap-5">
      {homeActivities.map(({ id, title, imageUrl, frameUrl, imageWidth, imageHeight }) => {
        const artwork = { title, imageUrl, frameUrl, imageWidth, imageHeight };
        return (
          <div key={id} className="grid max-w-lg grid-cols-3 gap-3">
            <div className="grid gap-1 text-center">
              <ActivityCard {...artwork} />
              <span className="text-xs text-muted-foreground">Idle</span>
            </div>
            <div className="grid gap-1 text-center">
              <ActivityCard {...artwork} selected />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
            <div className="grid gap-1 text-center">
              <ActivityCard {...artwork} unavailable disabled />
              <span className="text-xs text-muted-foreground">Unavailable</span>
            </div>
          </div>
        );
      })}
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
