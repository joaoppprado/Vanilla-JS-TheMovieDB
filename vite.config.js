import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: "index.html",
        popular: "popular.html",
        topRated: "topRated.html",
        myMovies: "myMovies.html",
      },
    },
  },
});
