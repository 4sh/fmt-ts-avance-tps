// Point d'entrée applicatif — chargé par index.html.
// La Partie 1 se joue dans src/i18n.ts.
import "./i18n.ts";
// La Partie 2 se joue dans src/routes.ts.
import "./routes.ts";

const output = document.getElementById("output");
if (output) {
  output.textContent += "Partie 1 : voir src/i18n.ts\n";
  output.textContent += "Partie 2 : voir src/routes.ts\n";
}
