import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

export async function validateMercadoPago(req: NextRequest) {
  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id");

  console.log(req.headers);

  if (!xSignature || !xRequestId) {
    return NextResponse.json({ error: "Headers ausentes" }, { status: 400 });
  }

  const parts = xSignature.split(",");

  let ts: string | undefined;
  let hash: string | undefined;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const [key, value] = part.split("=");
    if (key && value) {
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();
      if (trimmedKey === "ts") {
        ts = trimmedValue;
      } else if (trimmedKey === "v1") {
        hash = trimmedValue;
      }
    }
  }

  if (!ts || !hash) {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }

  const dataID = req.nextUrl.searchParams.get("data.id");

  let manifest = "";

  if (dataID) {
    manifest += `id:${dataID};`;
  }

  if (xRequestId) {
    manifest += `request-id:${xRequestId};`;
  }

  manifest += `ts:${ts}`;

  const secret = process.env.MP_WEBHOOK_SECRET as string;

  console.log({
    ts,
    hash,
    manifest,
    secret,
  });

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(manifest);
  const generatedHash = hmac.digest("hex");

  if (generatedHash !== hash) {
    console.log("HMAC verification failed");
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }
}
