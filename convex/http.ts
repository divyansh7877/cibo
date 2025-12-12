import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/webhook/order-status",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();

    await ctx.runMutation(api.orders.updateOrderStatus, {
      orderId: body.orderId,
      status: body.status,
      callTranscript: body.callTranscript,
      confirmationNumber: body.confirmationNumber,
      estimatedPickupTime: body.estimatedPickupTime,
      items: body.items,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
