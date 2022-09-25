import { DocumentReference, getDoc } from "firebase/firestore";

export async function getDocData<T>({
  docRef,
}: {
  docRef: DocumentReference<T>;
}) {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data;
  } else {
    return null;
  }
}
