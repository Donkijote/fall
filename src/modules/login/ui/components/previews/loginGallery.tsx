import { ProviderIcon } from "../../ProviderIcon";

export const loginGallery = {
  title: "Login",
  folder: "login",
  entries: [
    {
      name: "ProviderIcon",
      source: "src/modules/login/ui/ProviderIcon.tsx",
      variants: "Google, Apple, Microsoft and Facebook",
      usage: "Login · sign-in provider actions",
      Preview: () => (
        <ul aria-label="Sign-in providers" className="flex flex-wrap gap-4">
          {(["google", "apple", "microsoft", "facebook"] as const).map((provider) => (
            <li key={provider} className="grid justify-items-center gap-1 text-xs capitalize">
              <ProviderIcon provider={provider} />
              {provider}
            </li>
          ))}
        </ul>
      ),
    },
  ],
};
