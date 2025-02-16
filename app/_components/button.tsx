"use client";

import { useState } from "react";
import {
  CreatePayment,
  type TCreatePaymentResponse,
} from "../_actions/create-payment";
import Image from "next/image";

export const Button = () => {
  const [pixData, setPixData] = useState<TCreatePaymentResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await CreatePayment({
        document: "12345678909",
        email: "contato@robertoguerra.dev",
      });
      setPixData(response);
    } catch (err) {
      setError("Ocorreu um erro ao processar o pagamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-4">
      {pixData?.qr_code_base64 && (
        <div className="flex flex-col items-center gap-4">
          <div className="size-80 border rounded-md overflow-hidden flex items-center justify-center">
            <img
              src={`data:image/png;base64,${pixData.qr_code_base64}`}
              alt="qrcode"
              className="w-full h-full object-cover"
            />
          </div>
          <textarea
            value={pixData.qr_code}
            readOnly
            className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-black"
            rows={4}
          />
        </div>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      <button
        type="button"
        className="py-4 px-8 border rounded-md hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handlePay}
        disabled={isLoading}
      >
        {isLoading ? "Processando..." : "Pagar"}
      </button>
    </div>
  );
};
