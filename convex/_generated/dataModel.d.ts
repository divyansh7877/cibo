export type TableNames = "users" | "preferences" | "restaurants" | "orders" | "conversations";
export type Id<T extends TableNames> = string & { __tableName: T };
