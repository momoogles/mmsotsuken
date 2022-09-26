const { db } = require("./firebase");
const { collection, getDocs } = require("firebase/firestore");
const fs = require("fs");
const { exit } = require("process");
const { stringify } = require("csv-stringify/sync");

async function main() {
  console.log("データを読み取り中...");
  const snapshot = await getDocs(collection(db, "users"));
  console.log("データの読み取りが完了しました.");

  const data = [["uid", "group", "a", "b", "c", "d", "e"]];

  snapshot.forEach((doc) => {
    const { group, reactions } = doc.data();
    if (group && reactions) {
      const row = [doc.id, group, ...reactions];
      console.log("データ:", row);
      data.push(row);
    }
  });

  const output = stringify(data);
  fs.writeFileSync("dist.csv", output);
  console.log("ファイルを書き出しました.");

  exit();
}

main();
console.log("終了しました.");
