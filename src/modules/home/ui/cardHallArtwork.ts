import arena from "@/assets/lobby/card-hall/arena.webp";
import campaign from "@/assets/lobby/card-hall/campaign.webp";
import hall from "@/assets/lobby/card-hall/hall-landscape.webp";
import hallPhone from "@/assets/lobby/card-hall/hall-phone.webp";
import hallTablet from "@/assets/lobby/card-hall/hall-tablet.webp";
import tavern from "@/assets/lobby/card-hall/tavern.webp";
import traveller from "@/assets/lobby/card-hall/traveller.webp";

export const cardHallArtwork = { hall, hallPhone, hallTablet, traveller };

export const homeActivities = [
  {
    id: "tavern",
    title: "Tavern",
    imageUrl: tavern,
    imageWidth: 374,
    imageHeight: 386,
    available: true,
  },
  {
    id: "campaign",
    title: "Campaign",
    imageUrl: campaign,
    imageWidth: 401,
    imageHeight: 391,
    available: false,
  },
  {
    id: "arena",
    title: "Arena",
    imageUrl: arena,
    imageWidth: 376,
    imageHeight: 386,
    available: false,
  },
] as const;
