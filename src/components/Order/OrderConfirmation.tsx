import { CheckCircle, XCircle, UtensilsCrossed } from "lucide-react";
import { useOrder } from "../../hooks/useOrder";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { formatCurrency } from "../../lib/utils";
import type { OrderItem } from "../../types";

export function OrderConfirmation({ orderId, onNewOrder }: { orderId: string; onNewOrder: () => void }) {
  const { order } = useOrder(orderId);

  if (!order) {
    return <Card className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500 mx-auto" /></Card>;
  }

  const isConfirmed = order.status === "confirmed";
  const total = order.items.reduce((sum: number, item: OrderItem) => sum + item.price, 0);

  return (
    <div className="space-y-6">
      <Card className="text-center py-8">
        <div className="flex flex-col items-center gap-4">
          {isConfirmed ? <CheckCircle className="w-16 h-16 text-emerald-500" /> : <XCircle className="w-16 h-16 text-rose-500" />}
          <h2 className="text-2xl font-bold text-slate-800">{isConfirmed ? "Order Placed!" : "Order Failed"}</h2>
          {isConfirmed && order.restaurant && (
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-700">{order.restaurant.name}</p>
              <p className="text-slate-500">{order.restaurant.address}</p>
            </div>
          )}
        </div>
      </Card>
      {isConfirmed && (
        <Card>
          <h3 className="font-semibold text-slate-800 mb-4">Order Summary</h3>
          {order.items.length > 0 ? (
            <div className="space-y-2 border-b border-slate-200 pb-4 mb-4">
              {order.items.map((item: OrderItem, i: number) => (
                <div key={i} className="flex justify-between text-sm text-slate-700">
                  <span>{item.name}{item.notes && <span className="text-slate-400 ml-2">({item.notes})</span>}</span>
                  <span className="font-medium">{formatCurrency(item.price)}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-slate-500 mb-4">Order details being processed...</p>}
          {total > 0 && <div className="flex justify-between font-semibold text-slate-800 mb-4"><span>Total</span><span>{formatCurrency(total)}</span></div>}
          {order.estimatedPickupTime && <div className="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-100"><p className="text-sm text-emerald-600 font-medium">Estimated Pickup</p><p className="text-lg font-semibold text-emerald-700">{order.estimatedPickupTime}</p></div>}
          {order.confirmationNumber && <div className="mt-4 text-center"><p className="text-sm text-slate-500">Order #</p><p className="text-lg font-mono font-semibold text-slate-700">{order.confirmationNumber}</p></div>}
        </Card>
      )}
      <div className="flex justify-center">
        <Button onClick={onNewOrder}><UtensilsCrossed className="w-4 h-4 mr-2" />Start New Order</Button>
      </div>
    </div>
  );
}
