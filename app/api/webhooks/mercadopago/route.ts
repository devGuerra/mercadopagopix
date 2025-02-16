import { validateMercadoPago } from "@/app/middlewares/validateMercadoPago";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const validationError = await validateMercadoPago(req);
  if (validationError) return validationError;

  try {
    const body = await req.json();
    console.log("Notificação recebida:", body);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
