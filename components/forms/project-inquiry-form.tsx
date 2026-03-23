import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ProjectInquiryForm() {
  return (
    <form className="space-y-5" action="#">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input name="name" label="Namn" placeholder="Ditt namn" />
        <Input name="company" label="Företag" placeholder="Företagsnamn" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input name="email" type="email" label="E-post" placeholder="namn@foretag.se" />
        <Input name="role" label="Roll" placeholder="Founder, produktägare, marknadschef..." />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Select name="projectType" label="Typ av projekt" defaultValue="">
          <option value="" disabled>
            Välj typ av projekt
          </option>
          <option>Apputveckling</option>
          <option>Webbapputveckling</option>
          <option>AI-lösning</option>
          <option>MVP-utveckling</option>
          <option>Design / UX</option>
          <option>Teknisk rådgivning</option>
        </Select>
        <Select name="budget" label="Budget" defaultValue="">
          <option value="" disabled>
            Välj budgetnivå
          </option>
          <option>Under 100 000 SEK</option>
          <option>100 000–250 000 SEK</option>
          <option>250 000–500 000 SEK</option>
          <option>500 000+ SEK</option>
        </Select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Select name="timeline" label="Tidslinje" defaultValue="">
          <option value="" disabled>
            När vill ni starta?
          </option>
          <option>Så snart som möjligt</option>
          <option>Inom 1 månad</option>
          <option>Inom 2–3 månader</option>
          <option>Vi planerar fortfarande</option>
        </Select>
        <Input name="goal" label="Primärt mål" placeholder="Lansera MVP, effektivisera internt, öka konvertering..." />
      </div>

      <Textarea
        name="project"
        label="Berätta om projektet"
        placeholder="Beskriv nuläge, målbild, viktigaste behov och vad som känns mest oklart just nu."
        hint="Det här hjälper oss att förbereda rätt frågor inför nästa steg."
      />

      <Button type="submit" size="lg">
        Skicka projektförfrågan
      </Button>
    </form>
  );
}
