import { validateMercadoPago } from "@/app/middlewares/validateMercadoPago";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { NextResponse, type NextRequest } from "next/server";

const MERCADOPAGO_SECRET = process.env.MP_SECRET as string;

export async function POST(req: NextRequest) {
  const validationError = await validateMercadoPago(req);
  if (validationError) return validationError;

  try {
    const body = await req.json();
    console.log("Notificação recebida:", body);

    if (body.action === "payment.created") {
    }

    if (body.action === "payment.updated") {
      const client = new MercadoPagoConfig({
        accessToken: MERCADOPAGO_SECRET,
      });
      const payment = new Payment(client);

      const paymentData = payment.get({ id: body.data.id });

      console.log(paymentData);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
