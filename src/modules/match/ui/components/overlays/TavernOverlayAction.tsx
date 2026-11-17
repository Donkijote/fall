import { ActionButton, type ActionButtonProps } from "@/components/actions/ActionButton";

export function TavernOverlayAction({ tone = "primary", ...props }: ActionButtonProps) {
  return <ActionButton {...props} tone={tone} />;
}
