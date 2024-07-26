import crypto from "node:crypto";

export const generateRandomToken = async () => {
  const randomBytes = await Promise.resolve(crypto.randomBytes(20));
  const token = randomBytes.toString("hex");
  return token;
};
let profileImageNameList = [
  "Jasper",
  "Nala",
  "Sammy",
  "Harley",
  "Lucy",
  "Bob",
  "Snuggles",
  "Patches",
  "Tiger",
  "Smokey",
  "Leo",
  "Snickers",
  "Oliver",
  "Annie",
  "Socks",
  "Coco",
  "Buddy",
  "Chloe",
  "Callie",
  "Buster",
];

let profileImageCollectionList = [
  "adventurer-neutral",
  "fun-emoji",
  "lorelei-neutral",
  "avataaars-neutral",
  "big-ears-neutral",
  "bottts-neutral",
  "notionists-neutral",
  "pixel-art-neutral",
];

export const generateRandomAvatar = () => `
  https://api.dicebear.com/6.x/${
    profileImageCollectionList[
      Math.floor(Math.random() * profileImageCollectionList.length)
    ]
  }/svg?seed=
  ${
    profileImageNameList[
      Math.floor(Math.random() * profileImageNameList.length)
    ]
  }
  `;
export const addExpiryHours = () => {
  let currentTime = new Date();
  let futureTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
  return futureTime;
};
