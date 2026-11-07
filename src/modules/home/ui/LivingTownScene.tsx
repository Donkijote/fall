import "./living-town.css";

export function LivingTownScene() {
  return (
    <div className="living-town-scene" data-slot="living-town-scene" aria-hidden="true">
      <div className="living-town-sky" data-slot="living-town-sky" />
      <div className="living-town-clouds living-town-clouds-distant" />
      <div className="living-town-clouds living-town-clouds-near" />
      <div className="living-town-atmosphere" />
    </div>
  );
}
