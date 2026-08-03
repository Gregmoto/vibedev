"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  runExtendedAction,
  runNightlyAction,
  type BihrActionState,
} from "@/lib/admin-bihr-actions";

/**
 * Startar hämtningarna. Knapparna är avsiktligt separata: nattjobbet är litet
 * och går på sekunder, medan Extended drar hela sortimentet och tar minuter.
 */
export function BihrRunButtons() {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<BihrActionState>({});
  const [running, setRunning] = useState<string | null>(null);

  const run = (label: string, action: () => Promise<BihrActionState>) => {
    setRunning(label);
    setState({});
    startTransition(async () => {
      setState(await action());
      setRunning(null);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          size="sm"
          disabled={pending}
          onClick={() => run("nightly", runNightlyAction)}
        >
          {running === "nightly" ? "Startar…" : "Hämta HardPart + RiderGear nu"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={() => run("extended", runExtendedAction)}
        >
          {running === "extended" ? "Startar…" : "Hämta Extended"}
        </Button>
      </div>

      {state.error ? <p className="text-sm text-warning">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-success">{state.success}</p> : null}
    </div>
  );
}
