import React from "react";

type JsonLdProps = {
  data: Record<string, unknown>;
  id?: string;
};

export function JsonLd({ data, id = "jsonld" }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
