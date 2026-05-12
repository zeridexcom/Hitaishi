import { randomUUID } from "node:crypto";
import { Redis } from "@upstash/redis";
import type { Lead, LeadInput } from "./leadTypes";

const KEY = "leads:list";

let _redis: Redis | null = null;
function getRedis(): Redis {
  if (!_redis) _redis = Redis.fromEnv();
  return _redis;
}

export async function readLeads(): Promise<Lead[]> {
  const items = await getRedis().lrange<Lead>(KEY, 0, -1);
  return items;
}

export async function appendLead(input: LeadInput): Promise<Lead> {
  const lead: Lead = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await getRedis().lpush(KEY, lead);
  return lead;
}

export async function clearLeads(): Promise<void> {
  await getRedis().del(KEY);
}
