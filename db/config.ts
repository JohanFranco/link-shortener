import { column, defineDb, defineTable } from 'astro:db';

const Links = defineTable({
  columns: {
    originalLink: column.text(),
    shortedLink: column.text(),
  }
});

export default defineDb({
  tables: {
    Links
  }
});
