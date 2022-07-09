import { isIP } from "./deps.ts";

/** cidr2range converts CIDR to range of IP address. */
export function cidr2range(cidr: string): string[] {
  const addressParts = cidr.split("/");
  const ipAddress = addressParts[0];
  if (addressParts.length > 2) {
    throw new Error(`${cidr} contains more than one slash`);
  }
  if (!isIP(ipAddress)) {
    throw new Error(`${cidr} is invalid cidr format`);
  }
  const netmask = addressParts.length == 2 ? Number(addressParts[1]) : 32;
  if (isNaN(netmask)) {
    throw new Error(`${cidr} don't have valid netmask`);
  }
  const startIpL = ip2num(ipAddress) & createNetMask(netmask);
  const endIpL = Math.pow(2, 32 - netmask) + startIpL - 1;
  return [num2ip(startIpL), num2ip(endIpL)];
}

/** range2cidr converts range of IP address to CIDR. */
export function range2cidr(ipRange: string[]): string[] {
  if (ipRange.length != 2) {
    throw new Error(
      `ipRange contains only two ip address, length is ${ipRange.length}`,
    );
  }
  const startIp = ipRange[0];
  const endIp = ipRange[1];
  if (!(isIP(startIp) && isIP(endIp))) {
    throw new Error(
      `both startIp and endIp must be ip address, start ip is ${startIp}, end ip is ${endIp}`,
    );
  }

  let startIpL = ip2num(startIp);
  const endIpL = ip2num(endIp);

  const cidr = [];
  // https://blog.ip2location.com/knowledge-base/how-to-convert-ip-address-range-into-cidr/
  while (endIpL >= startIpL) {
    let maxSize = 32;
    while (maxSize > 0) {
      const mask = createNetMask(maxSize - 1);
      if ((startIpL & mask) != startIpL) {
        break;
      }
      maxSize -= 1;
    }
    const diff = 32 - Math.floor(Math.log2(endIpL - startIpL + 1));
    if (maxSize < diff) {
      maxSize = diff;
    }
    cidr.push(`${num2ip(startIpL)}/${maxSize}`);
    startIpL += Math.pow(2, 32 - maxSize);
  }
  return cidr;
}

/** ip2num converts IP address to number. */
export function ip2num(ipAddress: string): number {
  let shift = 0;
  let digit = 0;
  let octet = 0;
  let sum = 0;
  for (const char of ipAddress) {
    if (char == ".") {
      sum += octet << (8 * (3 - shift));
      shift += 1;
      digit = 0;
      octet = 0;
      continue;
    }
    if (digit > 0) {
      octet *= 10;
    }
    octet += Number(char);
    digit += 1;
  }
  return sum + octet;
}

/** num2ip converts number to IP address. */
export function num2ip(num: number): string {
  return [
    (num >> 24) & 255,
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255,
  ].join(".");
}

function createNetMask(size: number): number {
  return Math.round(Math.pow(2, 32) - Math.pow(2, 32 - size));
}
