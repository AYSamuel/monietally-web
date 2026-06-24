"use client";

import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Compact "EN | DE" control to match the minimalist nav. Switches locale in
// place via next-intl navigation (preserving the current path + hash); the
// NEXT_LOCALE cookie that next-intl writes makes the choice survive reloads.
export default function LocaleSwitcher() {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("localeSwitcher");

  function switchTo(next: string) {
    if (next === activeLocale) return;
    // usePathname() is locale-stripped; re-attach the hash so anchor targets
    // (e.g. /#faq) survive the switch. router.replace re-adds the new prefix.
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.replace(`${pathname}${hash}`, { locale: next });
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex items-center"
      style={{ gap: 2 }}
    >
      {routing.locales.map((l, i) => {
        const isActive = l === activeLocale;
        return (
          <Fragment key={l}>
            {i > 0 && (
              <span
                aria-hidden="true"
                style={{ color: "var(--text-tertiary)", opacity: 0.5, fontSize: 12 }}
              >
                |
              </span>
            )}
            <button
              type="button"
              lang={l}
              onClick={() => switchTo(l)}
              aria-current={isActive ? "true" : undefined}
              aria-label={t("switchTo", { language: t(`names.${l}`) })}
              className="inline-flex items-center justify-center transition-colors duration-200"
              style={{
                minWidth: 28,
                minHeight: 44,
                padding: "0 6px",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
              }}
            >
              {t(`short.${l}`)}
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
