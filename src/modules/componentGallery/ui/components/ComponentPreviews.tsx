import { Settings } from "lucide-react";
import { useState } from "react";

import diamonds from "@/assets/lobby/card-hall/icons/cut-diamond.svg";
import energy from "@/assets/lobby/card-hall/icons/electric.svg";
import levelCrest from "@/assets/lobby/card-hall/icons/rank-1.svg";
import coins from "@/assets/lobby/card-hall/icons/two-coins.svg";
import traveller from "@/assets/lobby/card-hall/traveller.webp";
import { PlayerIdentity, ResourceReadout } from "@/components";
import {
  ActionButton,
  ActivityCard,
  ChoiceButton,
  FramedCard,
  ModalContent,
  PopoverPanel,
  SelectField,
} from "@/components";
import { PlayerPortrait } from "@/components/hud/PlayerPortrait";
import { MotionPopover as Popover } from "@/components/surfaces/PopupMotion";
import { MotionDialog as Dialog } from "@/components/surfaces/PopupMotion";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
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

export function TurnRingPreview() {
  const [highlighted, setHighlighted] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-5">
      <PlayerPortrait avatarUrl={traveller} className="size-18" />
      <PlayerPortrait
        fallback={<span className="title-type text-2xl">M</span>}
        className="size-18"
      />
      <PlayerPortrait avatarUrl={traveller} highlighted={highlighted} className="size-18" />
      <ActionButton aria-pressed={highlighted} onClick={() => setHighlighted((value) => !value)}>
        Toggle active turn
      </ActionButton>
    </div>
  );
}

export function ProgressionPreview() {
  const [progress, setProgress] = useState({ level: 4, value: 60 });
  return (
    <div className="grid gap-4">
      <PlayerIdentity
        name="Traveller"
        fallbackAvatarUrl={traveller}
        levelCrestUrl={levelCrest}
        level={progress.level}
        experience={{ value: progress.value, maximum: 100 }}
      />
      <ActionButton
        onClick={() =>
          setProgress(({ level, value }) =>
            value + 25 >= 100
              ? { level: level + 1, value: value + 25 - 100 }
              : { level, value: value + 25 },
          )
        }
      >
        Gain XP
      </ActionButton>
    </div>
  );
}

export function ResourcePreview() {
  const [value, setValue] = useState(120);
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-3">
        <ResourceReadout label="Coins" icon={coins} value={value} />
        <ResourceReadout label="Energy" icon={energy} value={8} maximum={10} />
        <ResourceReadout label="Diamonds" icon={diamonds} />
      </div>
      <ActionButton onClick={() => setValue((amount) => amount + 25)}>Change balance</ActionButton>
    </div>
  );
}
