const MIN = 'a'.charCodeAt(0);
const MAX = 'z'.charCodeAt(0);

export function midString(prev: string, next: string): string {
  let p = 0;
  let n = 0;
  let pos = 0;

  for (pos = 0; p === n; pos++) {
    p = pos < prev.length ? prev.charCodeAt(pos) : MIN - 1;
    n = pos < next.length ? next.charCodeAt(pos) : MAX + 1;
  }

  let result = prev.slice(0, pos - 1);

  if (p === MIN - 1) {
    while (n === MIN) {
      n = pos < next.length ? next.charCodeAt(pos++) : MAX + 1;
      result += 'a';
    }

    if (n === MIN + 1) {
      result += 'a';
      n = MAX + 1;
    }
  } else if (p + 1 === n) {
    result += String.fromCharCode(p);
    n = MAX + 1;
    while ((p = pos < prev.length ? prev.charCodeAt(pos++) : MIN - 1) === MAX) {
      result += 'z';
    }
  }

  return result + String.fromCharCode(Math.ceil((p + n) / 2));
}

export function positionBetween(
  prev: string | null,
  next: string | null,
): string {
  return midString(prev ?? '', next ?? '');
}

console.log(midString('', ''));
console.log(midString('a', 'b'));
console.log(midString('an', 'b'));
console.log(midString('az', 'b'));
