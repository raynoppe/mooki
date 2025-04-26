"use client";

import type { Data } from "@measured/puck";
import { Puck } from "@measured/puck";
import config from "../../../puck.config";
import { useEffect } from "react";

export function Client({ path, data }: { path: string; data: Partial<Data> }) {
  return (
    <Puck
      config={config}
      data={data}
      overrides={{
        iframe: ({ children, document }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            // Defer until next render
            setTimeout(() => {
              if (document) {
                const tag = document.createElement("script");
                tag.src = "https://unpkg.com/@tailwindcss/browser@4";
                tag.async = true;
                document.head.appendChild(tag);
              }
            }, 0);
          }, [document]);

          return <>{children}</>;
        },
      }}
      iframe={{ enabled: true }}
      onPublish={async (data) => {
        await fetch("/puck/api", {
          method: "post",
          body: JSON.stringify({ data, path }),
        });
      }}
    />
  );
}
