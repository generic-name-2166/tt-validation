import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const dev = process.argv.includes("dev");
/**
 * Adding and deleting the slash because somehow it throws and error during svelte-kit sync
 * @type {`/${string}` | undefined}
 */
const crutch = process.env.BASE_PATH ? `/${process.env.BASE_PATH.slice(1)}` : undefined;

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
      base: dev ? "" : crutch, 
    },
  },
};

export default config;
