import MercadoPagoConfig from "mercadopago";

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_SECRET as string,
});
