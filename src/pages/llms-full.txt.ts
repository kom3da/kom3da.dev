import type { APIRoute } from "astro";
import { generateLlmsFullTxt } from "../lib/llms";
import { profile } from "../lib/profile";

export const GET: APIRoute = () => new Response(generateLlmsFullTxt(profile));
