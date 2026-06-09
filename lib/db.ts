import Dexie, { type EntityTable } from "dexie";

export interface Document {
  id: number;
  title: string;
  content: string;
  starred: boolean;
  updatedAt: number;
  createdAt: number;
}

const db = new Dexie("DocumentManagementDB") as Dexie & {
  documents: EntityTable<Document, "id">;
};

db.version(1).stores({
  documents: "++id, updatedAt",
});

// Version 2: adds starred field
db.version(2).stores({
  documents: "++id, updatedAt, starred",
});

export default db;
