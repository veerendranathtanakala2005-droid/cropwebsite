import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";
import { languages } from "@/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const clearLegacyGoogleTranslateArtifacts = () => {
  // Clear cookie if a previous build set it
  const expire = "Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = `googtrans=; expires=${expire}; path=/;`;
  document.cookie = `googtrans=; expires=${expire}; path=/; domain=${window.location.hostname}`;

  // Remove injected elements if they exist
  document.getElementById("google_translate_element")?.remove();
  document.getElementById("google-translate-script")?.remove();

  // Remove banner iframes/tooltips (best-effort)
  document
    .querySelectorAll(
      "iframe.goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame"
    )
    .forEach((el) => el.remove());

  // Google translate sometimes offsets the body
  document.body.style.top = "0px";
};

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    clearLegacyGoogleTranslateArtifacts();
  }, []);

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const currentLang =
    languages.find((l) => l.code === i18n.language) ?? languages[0];

  const changeLanguage = async (code: string) => {
    // Ensure detector cache is updated consistently
    localStorage.setItem("i18nextLng", code);
    await i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentLang.flag} {currentLang.name}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`cursor-pointer ${
              i18n.language === lang.code ? "bg-accent" : ""
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
