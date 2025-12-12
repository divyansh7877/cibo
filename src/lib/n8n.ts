export interface InitiateOrderPayload {
  agentId: string;
  phoneNumberId: string;
  restaurantPhone: string;
  restaurantName: string;
  orderItems: string;
  customerName: string;
  orderId: string;
  convexUrl: string;
}

export interface InitiateOrderResponse {
  success: boolean;
  callId: string;
  orderId: string;
  status: string;
}

export async function initiateOrderCall(payload: InitiateOrderPayload): Promise<InitiateOrderResponse> {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  if (!webhookUrl) throw new Error("N8N webhook URL not configured");
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Failed to initiate order call: ${response.statusText}`);
  return response.json();
}
