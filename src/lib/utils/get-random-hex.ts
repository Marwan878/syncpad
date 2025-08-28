export default function getRandomHex() {
  // I've chosen 0xDDDDDD to prevent getting light colors as the editor is already using a light theme
  return Math.floor(Math.random() * 0xdddddd).toString(16);
}
