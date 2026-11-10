import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { StorageKeys, StorageService } from "@/application/services/StorageService";
import { ActionButton, ModalContent, TextInput } from "@/components";
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { User } from "@/domain/entities/User";

type WelcomeModalProps = { onSave?: (user: User) => void };

export const WelcomeModal = ({ onSave }: WelcomeModalProps) => {
  const [username, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(() => !StorageService.get<User>(StorageKeys.FALL_USER));

  const handleSave = () => {
    if (!username.trim()) return;
    const user: User = {
      id: uuidv4(),
      name: username.trim(),
      username: username.trim(),
      email: "",
      avatar: "",
    };
    StorageService.set(StorageKeys.FALL_USER, user);
    onSave?.(user);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} disablePointerDismissal>
      <ModalContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Welcome to Fall!</DialogTitle>
          <DialogDescription>Enter your username to get started.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="welcome-username">Username</Label>
            <TextInput
              id="welcome-username"
              autoComplete="nickname"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Your username"
              required
            />
          </div>
          <ActionButton tone="primary" type="submit" disabled={!username.trim()}>
            Save
          </ActionButton>
        </form>
      </ModalContent>
    </Dialog>
  );
};
