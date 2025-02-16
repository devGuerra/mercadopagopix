"use server";

import { MercadoPagoConfig, Payment } from "mercadopago";
import { generateRandomHash } from "../_utils/randonHash";
import { mpClient } from "../_services/mercadopago";

export type TCreatePaymentResponse = {
  qr_code: string | undefined;
  qr_code_base64: string | undefined;
};

type TCreatePayment = {
  email: string;
  document: string;
};

export const CreatePayment = async ({ document, email }: TCreatePayment) => {
  const payment = new Payment(mpClient);

  const newPayment = await payment.create({
    requestOptions: {
      idempotencyKey: generateRandomHash(),
    },
    body: {
      transaction_amount: 0.01,
      description: "description",
      payment_method_id: "pix",
      payer: {
        email: email,
        identification: {
          number: document,
          type: "CPF",
        },
      },
    },
  });

  return {
    qr_code: newPayment.point_of_interaction?.transaction_data?.qr_code,
    qr_code_base64:
      newPayment.point_of_interaction?.transaction_data?.qr_code_base64,
  };
};
