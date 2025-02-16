import { validateMercadoPago } from "@/app/_middlewares/validateMercadoPago";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { NextResponse, type NextRequest } from "next/server";
import { mpClient } from "../../../_services/mercadopago";

export async function POST(req: NextRequest) {
  const validationError = await validateMercadoPago(req);
  if (validationError) return validationError;

  try {
    const body = await req.json();

    const payment = new Payment(mpClient);

    if (body.action === "payment.created") {
    }

    if (body.action === "payment.updated") {
      const paymentData = await payment.get({ id: body.data.id });
      const isPaid = paymentData.status === "approved";

      console.log("Pago");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
