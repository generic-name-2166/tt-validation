import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const local = process.argv.includes("dev") || process.argv.includes("preview");
console.log(process.env.BASE_PATH);
console.log("/tt-validation" === process.env.BASE_PATH);
/**
 * @type {`/${string}` | undefined}
 */
const crutch = process.env.BASE_PATH;

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    paths: {
      base: local ? "" : crutch, 
    },
  },
};

export default config;
