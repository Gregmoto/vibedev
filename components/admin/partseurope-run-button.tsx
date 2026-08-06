"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { runPartsEuropeAction, type CredentialState } from "@/lib/admin-integration-actions";

/** Hämtar prisfilen direkt, utan att vänta på nattkörningen. */
export function PartsEuropeRunButton() {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<CredentialState>({});

  return (
    <div className="space-y-3">
      <Button
        type="button"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setState({});
            setState(await runPartsEuropeAction());
          })
        }
      >
        {pending ? "Startar…" : "Hämta nu"}
      </Button>

      {state.error ? <p className="text-sm text-warning">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-success">{state.success}</p> : null}
    </div>
  );
}
