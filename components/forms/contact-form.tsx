import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  return (
    <form className="space-y-5" action="#">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input name="name" label="Namn" placeholder="Ditt namn" />
        <Input name="company" label="Företag" placeholder="Företagsnamn" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input name="email" type="email" label="E-post" placeholder="namn@foretag.se" />
        <Input name="phone" type="tel" label="Telefon" placeholder="+46 ..." />
      </div>
      <Textarea
        name="message"
        label="Vad vill ni ha hjälp med?"
        placeholder="Beskriv kort ert projekt, nuläge och vad ni vill uppnå."
        hint="Ju tydligare ni är, desto snabbare kan vi ge ett relevant nästa steg."
      />
      <Button type="submit" size="lg">
        Skicka förfrågan
      </Button>
    </form>
  );
}
