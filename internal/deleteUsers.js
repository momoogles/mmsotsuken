const fs = require("fs");
const { parse } = require("csv-parse");
const { db } = require("./firebase");
const { writeBatch, doc, collection, getDocs } = require("firebase/firestore");
const { exit } = require("process");

// 1. rootにusers.csvを 'uid,group' のformatで置く
// 2. yarn firebase:delete-usersを実行する

async function main() {
  const batch = writeBatch(db);

  console.log("データを読み取り中...");
  const snapshot = await getDocs(collection(db, "users"));
  let unlockedUsers = [];
  snapshot.docs.forEach((doc) => {
    const { locked } = doc.data();
    if (!locked) {
      unlockedUsers.push(doc.id);
    }
  });
  console.log("データの読み取りが完了しました.");

  console.log("データを削除します.");
  fs.createReadStream("./users.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", ([uid, group]) => {
      console.log("データ:", [uid, group]);
      if (unlockedUsers.includes(uid) && group) {
        batch.delete(doc(db, "users", uid));
      }
    })
    .on("end", async () => {
      console.log("バッチを実行中...");
      await batch.commit();
      console.log("バッチが完了しました.");
      exit();
    });
}

main();
console.log("終了しました.");
