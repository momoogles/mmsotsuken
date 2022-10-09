export interface UserDocument {
  group: "plain" | "with-motion";
  locked: boolean;
  mobile?: boolean;
  reactions?: number[];
}
