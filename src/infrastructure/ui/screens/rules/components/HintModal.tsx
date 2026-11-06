import { useState } from "react";

import { StorageKeys, StorageService } from "@/application/services/StorageService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const HintModal = () => {
  const [open, setOpen] = useState(() => !StorageService.get<boolean>(StorageKeys.FALL_RULES_SEEN));
  const dismiss = () => {
    StorageService.set<boolean>(StorageKeys.FALL_RULES_SEEN, true);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) dismiss();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Fall Rules</DialogTitle>
          <DialogDescription>
            A fast, readable guide. Use the tabs above; expand items for examples.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Quick start</CardTitle>
            </CardHeader>
            <CardContent>Go to Setup → Dealer choices, then Turn.</CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Sings sheet</CardTitle>
            </CardHeader>
            <CardContent>Open the Sings tab for patterns and points.</CardContent>
          </Card>
        </div>
        <DialogFooter>
          <Button onClick={dismiss} data-testid="got-it-button">
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
