import type { APIRoute } from "astro";
import { generateLlmsTxt } from "../lib/llms";
import { profile } from "../lib/profile";

export const GET: APIRoute = () => new Response(generateLlmsTxt(profile));
