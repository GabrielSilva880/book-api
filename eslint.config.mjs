import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  // Arquivos / pastas que o ESLint deve ignorar
  {
    ignores: ["node_modules/**", "coverage/**", "dist/**"]
  },

  // Regras recomendadas de JavaScript
  js.configs.recommended,

  // Regras recomendadas de TypeScript
  ...tseslint.configs.recommended,

  {
    // Aqui configuramos o ambiente e opções de parser
    languageOptions: {
      globals: {
        // Diz pro ESLint que estamos em ambiente Node
        ...globals.node
      }
    }
  }
);
