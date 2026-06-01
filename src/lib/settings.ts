import { DEFAULT_OFF_DAYS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export async function getOffDays() {
  const setting = await prisma.appSetting.findUnique({ where: { key: "offDays" } });
  if (!setting) return DEFAULT_OFF_DAYS;
  const value = setting.value;
  return Array.isArray(value) ? value.map(Number) : DEFAULT_OFF_DAYS;
}

export async function setOffDays(offDays: number[]) {
  return prisma.appSetting.upsert({
    where: { key: "offDays" },
    create: { key: "offDays", value: offDays },
    update: { value: offDays }
  });
}
