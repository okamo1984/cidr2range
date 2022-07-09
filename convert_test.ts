import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import { cidr2range, ip2num, num2ip, range2cidr } from "./convert.ts";

type CidrTestData = {
  cidr: string;
  testName?: string;
  range?: string[];
};

Deno.test("cidr2range", async (t) => {
  for (
    const { cidr, range } of [
      { cidr: "1.1.1.1/32", range: ["1.1.1.1", "1.1.1.1"] },
      { cidr: "1.1.1.0/24", range: ["1.1.1.0", "1.1.1.255"] },
      { cidr: "1.1.0.0/16", range: ["1.1.0.0", "1.1.255.255"] },
      { cidr: "1.0.0.0/8", range: ["1.0.0.0", "1.255.255.255"] },
      { cidr: "1.1.1.2/29", range: ["1.1.1.0", "1.1.1.7"] },
      { cidr: "1.1.1.1/25", range: ["1.1.1.0", "1.1.1.127"] },
    ] as CidrTestData[]
  ) {
    await t.step(cidr, () => {
      assertEquals(cidr2range(cidr), range);
    });
  }

  for (
    const { cidr, testName } of [
      { cidr: "111111111", testName: "cidr is invalid 1" },
      { cidr: "1.1.1.1.1", testName: "cidr is invalid 2" },
      { cidr: "256.1.1.1", testName: "cidr is invalid 3" },
      { cidr: "1.256.1.1", testName: "cidr is invalid 4" },
      { cidr: "1.1.1.256", testName: "cidr is invalid 5" },
      { cidr: "1/32.1.1.1", testName: "cidr is invalid 6" },
      { cidr: "1.1/32.1.1", testName: "cidr is invalid 7" },
      { cidr: "1.1.1/32.1", testName: "cidr is invalid 8" },
      { cidr: "1.1.1.1/32/1", testName: "cidr is invalid 9" },
      { cidr: "1.1.1.1/aaaa", testName: "cidr is invalid 10" },
    ] as CidrTestData[]
  ) {
    await t.step(testName!, () => {
      assertThrows(() => cidr2range(cidr), "cidr is invalid");
    });
  }
});

Deno.test("range2cidr", async (t) => {
  await t.step("ip range to cidr", () => {
    const ipRange = ["10.0.0.1", "10.0.0.10"];
    assertEquals(range2cidr(ipRange), [
      "10.0.0.1/32",
      "10.0.0.2/31",
      "10.0.0.4/30",
      "10.0.0.8/31",
      "10.0.0.10/32",
    ]);
  });
});

Deno.test("s2l and l2s", async (t) => {
  for (
    const ipAddress of [
      "1.1.1.1",
      "10.1.1.1",
      "1.10.1.1",
      "1.1.10.1",
      "1.1.1.10",
      "100.1.1.1",
      "1.100.1.1",
      "1.1.100.1",
      "1.1.1.100",
      "0.0.0.0",
      "255.255.255.255",
    ]
  ) {
    await t.step(ipAddress, () => {
      assertEquals(num2ip(ip2num(ipAddress)), ipAddress);
    });
  }
});
