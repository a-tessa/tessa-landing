"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import {
  submitTalentApplication,
  type TalentApplicationActionState,
} from "@/app/actions/talent-application";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const EDUCATION_LEVELS = [
  { value: "Ensino Fundamental incompleto", key: "elementaryIncomplete" },
  { value: "Ensino Fundamental completo", key: "elementaryComplete" },
  { value: "Ensino Médio incompleto", key: "highSchoolIncomplete" },
  { value: "Ensino Médio completo", key: "highSchoolComplete" },
  { value: "Ensino Superior incompleto", key: "higherIncomplete" },
  { value: "Ensino Superior completo", key: "higherComplete" },
  { value: "Pós-graduação", key: "postgraduate" },
  { value: "Mestrado", key: "masters" },
  { value: "Doutorado", key: "doctorate" },
] as const;

const PRACTICE_AREAS = [
  { value: "Produção", key: "production" },
  { value: "Comercial", key: "commercial" },
  { value: "Financeiro", key: "finance" },
  { value: "Atendimento ao Cliente", key: "customerService" },
  { value: "Tecnologia", key: "technology" },
  { value: "Outro", key: "other" },
] as const;

const initialState: TalentApplicationActionState = { status: "idle" };

const fieldClassName =
  "h-12 rounded-xl border-border bg-white shadow-none focus-visible:border-primary focus-visible:ring-0";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const PHONE_PATTERN = "^\\(\\d{2}\\) \\d{4}-\\d{4}$|^\\(\\d{2}\\) \\d{5}-\\d{4}$";

function isValidEmail(value: string): boolean {
  const email = value.trim();
  if (email.length === 0 || email.length > 200 || !EMAIL_RE.test(email)) {
    return false;
  }
  const domain = email.slice(email.lastIndexOf("@") + 1);
  return !domain.includes("..") && !domain.startsWith(".") && !domain.endsWith(".");
}

function normalizeBrazilPhoneDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("55") && digits.length > 11) {
    digits = digits.slice(2, 13);
  } else {
    digits = digits.slice(0, 11);
  }

  return digits;
}

/** DDD + 8 dígitos `(00) 0000-0000` ou DDD + 9 `(00) 00000-0000`. */
function formatBrazilPhoneDisplay(raw: string): string {
  const digits = normalizeBrazilPhoneDigits(raw);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;

  const areaCode = digits.slice(0, 2);
  const subscriber = digits.slice(2);

  if (subscriber.length <= 8) {
    if (subscriber.length <= 4) return `(${areaCode}) ${subscriber}`;
    return `(${areaCode}) ${subscriber.slice(0, 4)}-${subscriber.slice(4)}`;
  }

  return `(${areaCode}) ${subscriber.slice(0, 5)}-${subscriber.slice(5)}`;
}

export function TalentApplicationForm() {
  const t = useTranslations("talentApplication");
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(
    submitTalentApplication,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  const handlePhoneChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPhoneDisplay(formatBrazilPhoneDisplay(event.target.value));
    },
    [],
  );

  const handleEmailBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value.trim();
      if (value.length === 0 || isValidEmail(value)) {
        setEmailError(null);
        return;
      }
      setEmailError(t("errors.email"));
    },
    [t],
  );

  const handleEmailChange = useCallback(() => {
    setEmailError(null);
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setPhoneDisplay("");
      setEmailError(null);
    }
  }, [state.status]);

  const visibleEmailError = state.fieldErrors?.email ?? emailError;

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex w-full flex-col gap-8"
      noValidate
    >
      {state.status === "success" && state.message ? (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-4 rounded-2xl border border-emerald-200/70 bg-linear-to-br from-emerald-50 to-emerald-100/40 p-5 shadow-sm"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700">
            <CheckCircle2 className="size-5" aria-hidden />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold text-emerald-900">
              {t("successTitle")}
            </p>
            <p className="text-sm leading-relaxed text-emerald-900/80">
              {state.message}
            </p>
          </div>
        </div>
      ) : null}

      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.message}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="talent-name">{t("fullName")}</Label>
        <Input
          id="talent-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(state.fieldErrors?.fullName)}
          className={fieldClassName}
        />
        {state.fieldErrors?.fullName ? (
          <p className="text-xs text-destructive">{state.fieldErrors.fullName}</p>
        ) : null}
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="talent-email">{t("email")}</Label>
          <Input
            id="talent-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={200}
            spellCheck={false}
            onBlur={handleEmailBlur}
            onChange={handleEmailChange}
            aria-invalid={Boolean(visibleEmailError)}
            className={fieldClassName}
          />
          {visibleEmailError ? (
            <p className="text-xs text-destructive">{visibleEmailError}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="talent-phone">{t("phone")}</Label>
          <Input
            id="talent-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            required
            value={phoneDisplay}
            onChange={handlePhoneChange}
            placeholder={t("phonePlaceholder")}
            maxLength={15}
            pattern={PHONE_PATTERN}
            title={t("phoneTitle")}
            aria-describedby="talent-phone-hint"
            aria-invalid={Boolean(state.fieldErrors?.phone)}
            className={fieldClassName}
          />
          <p id="talent-phone-hint" className="sr-only">
            {t("phoneHint")}
          </p>
          {state.fieldErrors?.phone ? (
            <p className="text-xs text-destructive">{state.fieldErrors.phone}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="talent-education-level">{t("educationLevel")}</Label>
          <Select name="educationLevel" required>
            <SelectTrigger
              id="talent-education-level"
              className={cn(fieldClassName, "h-12! w-full")}
              iconClassName="text-primary"
              aria-invalid={Boolean(state.fieldErrors?.educationLevel)}
            >
              <SelectValue placeholder={t("educationLevelPlaceholder")} />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className="w-(--radix-select-trigger-width)"
            >
              {EDUCATION_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {t(`educationLevels.${level.key}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.fieldErrors?.educationLevel ? (
            <p className="text-xs text-destructive">
              {state.fieldErrors.educationLevel}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="talent-education">{t("education")}</Label>
          <Input
            id="talent-education"
            name="education"
            type="text"
            required
            aria-invalid={Boolean(state.fieldErrors?.education)}
            className={fieldClassName}
          />
          {state.fieldErrors?.education ? (
            <p className="text-xs text-destructive">{state.fieldErrors.education}</p>
          ) : null}
        </div>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium">{t("practiceArea")}</legend>
        <div className="flex flex-wrap gap-2">
          {PRACTICE_AREAS.map((area) => (
            <label
              key={area.value}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/10"
            >
              <input
                type="radio"
                name="practiceArea"
                value={area.value}
                required
                className="size-4 accent-primary"
                aria-invalid={Boolean(state.fieldErrors?.practiceArea)}
              />
              {t(`areas.${area.key}`)}
            </label>
          ))}
        </div>
        {state.fieldErrors?.practiceArea ? (
          <p className="text-xs text-destructive">{state.fieldErrors.practiceArea}</p>
        ) : null}
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor="talent-summary">{t("professionalSummary")}</Label>
        <Textarea
          id="talent-summary"
          name="professionalSummary"
          rows={5}
          required
          aria-invalid={Boolean(state.fieldErrors?.professionalSummary)}
          className={cn(
            fieldClassName,
            "h-auto min-h-32 resize-y p-4",
          )}
        />
        {state.fieldErrors?.professionalSummary ? (
          <p className="text-xs text-destructive">
            {state.fieldErrors.professionalSummary}
          </p>
        ) : null}
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="secondary" className="px-8" disabled={isPending}>
          {isPending ? t("pending") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
