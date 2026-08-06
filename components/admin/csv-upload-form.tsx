"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { uploadCsvAction, type CsvUploadState } from "@/lib/admin-csv-actions";

type CsvUploadFormProps = {
  /** Satt när formuläret ersätter en befintlig fil i stället för att skapa ny. */
  replaceId?: string;
  replaceName?: string;
};

const initialState: CsvUploadState = {};

export function CsvUploadForm({ replaceId, replaceName }: CsvUploadFormProps) {
  const [state, formAction, isPending] = useActionState(uploadCsvAction, initialState);

  return (
    <form action={formAction} className="space-y-3" aria-busy={isPending}>
      {replaceId ? <input type="hidden" name="replaceId" value={replaceId} /> : null}

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          name="file"
          accept=".csv,text/csv,text/plain"
          required
          // key nollställer fältet efter lyckad uppladdning, så samma fil inte
          // råkar skickas två gånger.
          key={state.success ?? "tom"}
          className="block text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/[0.08] file:px-4 file:py-2 file:text-sm file:font-medium file:text-text"
        />
        <Button type="submit" size="sm" variant={replaceId ? "secondary" : "primary"} disabled={isPending}>
          {isPending ? "Laddar upp…" : replaceId ? `Ersätt ${replaceName ?? "filen"}` : "Ladda upp"}
        </Button>
      </div>

      {state.error ? <p className="text-sm text-warning">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-success">{state.success}</p> : null}
    </form>
  );
}
