import inn from "@/assets/lobby/tavern/inn-landscape.webp";

export function TavernBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <img src={inn} alt="" width={1672} height={941} className="size-full object-cover" />
    </div>
  );
}
