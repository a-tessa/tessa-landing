"use client";

import { submitTestimonial } from "@/app/actions/testimonial";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { IconArrowNarrowRight, IconStarFilled } from "@tabler/icons-react";
import {
  type ReactNode,
  useActionState,
  useCallback,
  useId,
  useState,
} from "react";

const MAX_TEXT = 500;
const MAX_NAME = 120;

interface TestimonialFormProps {
  onSuccessClose: () => void;
}

function TestimonialForm({ onSuccessClose }: TestimonialFormProps) {
  const [state, formAction, isPending] = useActionState(submitTestimonial, {
    status: "idle",
  });
  const [rating, setRating] = useState<number>(0);
  const [textLen, setTextLen] = useState(0);

  const nameId = useId();
  const companyId = useId();
  const textId = useId();
  const ratingLegendId = useId();

  if (state.status === "success" && state.message) {
    return (
      <div className="flex flex-col gap-4 py-2">
        <p className="text-sm text-foreground" role="status">
          {state.message}
        </p>
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={onSuccessClose}
        >
          Fechar
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor={nameId}>Nome</Label>
        <Input
          id={nameId}
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={MAX_NAME}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? `${nameId}-error` : undefined}
        />
        {state.fieldErrors?.name ? (
          <p id={`${nameId}-error`} className="text-sm text-destructive">
            {state.fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor={companyId}>Nome da empresa</Label>
        <Input
          id={companyId}
          name="company"
          autoComplete="organization"
          required
          minLength={2}
          maxLength={MAX_NAME}
          aria-invalid={Boolean(state.fieldErrors?.company)}
          aria-describedby={
            state.fieldErrors?.company ? `${companyId}-error` : undefined
          }
        />
        {state.fieldErrors?.company ? (
          <p id={`${companyId}-error`} className="text-sm text-destructive">
            {state.fieldErrors.company}
          </p>
        ) : null}
      </div>

      <fieldset className="grid gap-2 border-0 p-0">
        <legend
          id={ratingLegendId}
          className="text-sm leading-none font-medium text-foreground"
        >
          Nota
        </legend>
        <input type="hidden" name="rating" value={rating || ""} />
        <div
          className="flex flex-wrap items-center gap-2"
          role="radiogroup"
          aria-labelledby={ratingLegendId}
        >
          {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              className={cn(
                "rounded-md p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                value <= rating ? "text-primary" : "text-muted-foreground/35",
              )}
              aria-label={`Nota ${value} de 5`}
              onClick={() => setRating(value)}
            >
              <IconStarFilled className="size-8" aria-hidden />
            </button>
          ))}
        </div>
        {state.fieldErrors?.rating ? (
          <p className="text-sm text-destructive">{state.fieldErrors.rating}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Toque nas estrelas para escolher de 1 a 5.
          </p>
        )}
      </fieldset>

      <div className="grid gap-2">
        <div className="flex items-end justify-between gap-2">
          <Label htmlFor={textId}>Depoimento</Label>
          <span
            className={cn(
              "text-xs tabular-nums text-muted-foreground",
              textLen > MAX_TEXT && "text-destructive",
            )}
            aria-live="polite"
          >
            {textLen}/{MAX_TEXT}
          </span>
        </div>
        <Textarea
          id={textId}
          name="text"
          required
          rows={5}
          maxLength={MAX_TEXT}
          placeholder="Conte como foi sua experiência com a Tessa..."
          aria-invalid={Boolean(state.fieldErrors?.text)}
          aria-describedby={
            state.fieldErrors?.text ? `${textId}-error` : `${textId}-hint`
          }
          onChange={(e) => setTextLen(e.target.value.length)}
        />
        <p id={`${textId}-hint`} className="sr-only">
          Máximo de {MAX_TEXT} caracteres.
        </p>
        {state.fieldErrors?.text ? (
          <p id={`${textId}-error`} className="text-sm text-destructive">
            {state.fieldErrors.text}
          </p>
        ) : null}
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Enviando…" : "Enviar depoimento"}
        </Button>
      </DialogFooter>
    </form>
  );
}

interface WriteTestimonialDialogProps {
  triggerClassName?: string;
  children?: ReactNode;
}

export function WriteTestimonialDialog({
  triggerClassName,
  children,
}: WriteTestimonialDialogProps) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);
  const handleSuccessClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setSession((s) => s + 1);
        }
      }}
    >
      <DialogTrigger asChild>
        {children ?? (
          <button
            type="button"
            className={cn(
              "mt-4 inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90",
              triggerClassName,
            )}
          >
            Escrever depoimento
            <IconArrowNarrowRight className="size-4" aria-hidden />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[min(90dvh,720px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-barlow text-xl uppercase text-primary sm:text-2xl">
            Escrever depoimento
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo. Seu depoimento pode ter até {MAX_TEXT}{" "}
            caracteres.
          </DialogDescription>
        </DialogHeader>
        <TestimonialForm key={session} onSuccessClose={handleSuccessClose} />
      </DialogContent>
    </Dialog>
  );
}
