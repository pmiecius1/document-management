import Dexie, { type EntityTable } from "dexie";

export interface Document {
  id: number;
  title: string;
  content: string;
  updatedAt: number;
  createdAt: number;
}

const db = new Dexie("DocumentManagementDB") as Dexie & {
  documents: EntityTable<Document, "id">;
};

db.version(1).stores({
  documents: "++id, updatedAt",
});

export default db;
