"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  BRAZILIAN_REGIONS,
  type Representative,
  getStateNameByUf,
  representativesForState,
} from "@/lib/representatives";
import { Copy, Mail, MapPin, Phone } from "lucide-react";
import { Fragment, useCallback, useState } from "react";
import { Button } from "../ui/button";

interface RepresentativeCardProps {
  representative: Representative;
}

function CopyFieldButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }, [value]);

  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={handleCopy}
      aria-label={`${label}: copiar ${value}`}
      className="text-primary cursor-pointer"
    >
      <Copy className="size-4 stroke-3" aria-hidden />
      {copied ? "Copiado!" : "Copiar"}
    </Button>
  );
}

function RepresentativeCard({ representative }: RepresentativeCardProps) {
  const { name, segment, phone, email, city, stateUf } = representative;
  const locationLabel = `${city} / ${stateUf}`;

  return (
    <article
      className={cn(
        "flex flex-col gap-6 rounded-3xl bg-card p-6 text-card-foreground hover:shadow-xl transition-shadow duration-700",
        "ring-1 ring-border/60",
      )}
    >
      <header className="flex flex-col">
        <h3 className="text-xl font-medium text-foreground mb-1">{name}</h3>
        <p className="text-xs text-muted-foreground leading-none">Segmento</p>
        <p className="text-sm font-semibold text-foreground">{segment}</p>
      </header>

      <ul className="flex flex-col gap-4 text-lg text-foreground font-semibold w-full">
        <li className="flex flex-wrap items-center gap-2 w-82 md:w-auto">
          <Phone className="size-4 shrink-0 text-primary mt-1" aria-hidden />
          <span className="min-w-0 break-all">{phone}</span>
          <CopyFieldButton label="Telefone" value={phone} />
        </li>
        <li className="flex items-center gap-2 w-82 md:w-auto">
          <Mail className="size-4 shrink-0 text-primary mt-1" aria-hidden />
          <span className="min-w-0 shrink truncate">{email}</span>
          <CopyFieldButton label="E-mail" value={email} />
        </li>
        <li className="flex flex-wrap items-center gap-2 w-82 md:w-auto">
          <MapPin className="size-4 shrink-0 text-primary mt-1" aria-hidden />
          <span className="min-w-0">{locationLabel}</span>
        </li>
      </ul>
    </article>
  );
}

const DEFAULT_UF = "MG";

export function RepresentativesDirectory() {
  const [uf, setUf] = useState<string>(DEFAULT_UF);
  const stateName = getStateNameByUf(uf) ?? uf;
  const list = representativesForState(uf);

  return (
    <section
      className={cn("w-full rounded-2xl")}
      aria-labelledby="representantes-titulo"
    >
      <div className="mx-auto flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <div className="flex max-w-xl flex-1 flex-col gap-5">
          <h2
            id="representantes-titulo"
            className="text-balance text-xl font-bold uppercase tracking-tight text-foreground sm:text-2xl md:text-3xl"
          >
            Consulte um dos nossos representantes da sua região.
          </h2>

          <Select value={uf} onValueChange={setUf}>
            <SelectTrigger
              aria-label="Selecionar estado"
              className={cn(
                "h-13! md:h-14! px-8 text-base w-full md:w-md rounded-full bg-primary text-white",
              )}
              iconClassName="text-white"
            >
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="w-(--radix-select-trigger-width)"
            >
              {BRAZILIAN_REGIONS.map((region, regionIndex) => (
                <Fragment key={region.id}>
                  {regionIndex > 0 ? <SelectSeparator /> : null}
                  <SelectGroup>
                    <SelectLabel className="font-semibold text-foreground">
                      {region.name}
                    </SelectLabel>
                    {region.states.map((s) => (
                      <SelectItem key={s.uf} value={s.uf}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </Fragment>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className="mx-auto mt-10 border-t border-border pt-8"
        role="region"
        aria-live="polite"
        aria-label={`Representantes em ${stateName}`}
      >
        <p className="mb-8 text-base font-bold text-foreground">
          Estado selecionado &quot;{stateName}&quot;
        </p>

        {list.length === 0 ? (
          <p className="text-muted-foreground">
            Ainda não há representantes cadastrados para este estado. Entre em
            contato conosco para outras regiões.
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {list.map((rep) => (
              <li key={rep.id}>
                <RepresentativeCard representative={rep} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
