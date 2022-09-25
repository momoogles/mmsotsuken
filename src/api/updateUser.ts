import { Firestore, doc, DocumentReference } from "firebase/firestore";
import { UserDocument } from "./types";
import { setDocData } from "./utils";

export async function updateUser(
  db: Firestore,
  {
    id,
    newDocument,
  }: {
    id: string;
    newDocument: UserDocument;
  }
) {
  const docRef = doc(db, "users", id) as DocumentReference<UserDocument>;
  try {
    return setDocData<UserDocument>({ docRef, newDocument });
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error(e);
    }
  }
}
