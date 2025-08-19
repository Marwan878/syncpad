export default function getRandomHex() {
  return Math.floor(Math.random() * 0xffffff).toString(16);
}
