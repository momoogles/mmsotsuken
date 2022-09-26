const fs = require("fs");
const { parse } = require("csv-parse");
const { db } = require("./firebase");
const { writeBatch, doc } = require("firebase/firestore");
const { exit } = require("process");

// 1. rootにusers.csvを 'uid,group' のformatで置く
// 2. yarn firebase:create-usersを実行する

async function main() {
  const batch = writeBatch(db);

  fs.createReadStream("./users.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", ([uid, group]) => {
      console.log("データ:", [uid, group]);
      if (uid && group) {
        batch.set(doc(db, "users", uid), { group, locked: false });
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
