import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

const MERCADOPAGO_SECRET = process.env.MP_WEBHOOK_SECRET as string;

export async function validateMercadoPago(
  req: NextRequest
): Promise<NextResponse | null> {
  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id");

  if (!xSignature || !xRequestId) {
    return NextResponse.json({ error: "Headers ausentes" }, { status: 400 });
  }

  const parts = xSignature.split(",");

  let ts: string | undefined;
  let hash: string | undefined;

  // Usando 'for' para iterar sobre as partes
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

  if (!dataID) {
    return NextResponse.json(
      { error: "Query param data.id ausente" },
      { status: 400 }
    );
  }

  const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;
  const hmac = crypto.createHmac("sha256", MERCADOPAGO_SECRET);
  hmac.update(manifest);
  const sha = hmac.digest("hex");

  if (sha === hash) {
    console.log("HMAC verification passed");
    return null;
  }
  console.log("HMAC verification failed");
  return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
}
