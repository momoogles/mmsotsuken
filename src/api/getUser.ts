import { Firestore, doc, DocumentReference } from "firebase/firestore";
import { UserDocument } from "./types";
import { getDocData } from "./utils";

export async function getUser(
  db: Firestore,
  {
    id,
  }: {
    id: string;
  }
) {
  const docRef = doc(db, "users", id) as DocumentReference<UserDocument>;
  try {
    return getDocData<UserDocument>({ docRef });
  } catch (e) {
    throw e;
  }
}
