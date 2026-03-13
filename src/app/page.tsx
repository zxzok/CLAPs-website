import { PaperWebsite } from "@/components/paper-website";
import { loadRealResults, loadResultHighlights, loadSyntheticResults } from "@/lib/results";

export default function HomePage() {
  const synthetic = loadSyntheticResults();
  const real = loadRealResults();
  const highlights = loadResultHighlights();

  return <PaperWebsite synthetic={synthetic} real={real} highlights={highlights} />;
}
