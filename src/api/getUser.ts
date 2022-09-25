import { Firestore, doc } from "firebase/firestore";
import { getDocData } from "./utils";

export async function getUser(
  db: Firestore,
  {
    id,
  }: {
    id: string;
  }
) {
  const docRef = doc(db, "users", id);
  try {
    return getDocData<{
      group?: "plain" | "with-motion";
      reactions?: number[];
    }>({ docRef });
  } catch (e) {
    throw e;
  }
}
