export interface UserDocument {
  group: "plain" | "with-motion";
  locked: boolean;
  reactions?: number[];
}
